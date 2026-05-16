import { pool } from '../db/pool.js'
import { httpError } from './errors.js'

export async function listMenus() {
  const result = await pool.query(`
    select
      m.id as menu_id,
      m.name as menu_name,
      m.description,
      m.price as menu_price,
      m.image_url,
      m.stock_quantity,
      o.id as option_id,
      o.name as option_name,
      o.price as option_price
    from menus m
    left join options o on o.menu_id = m.id
    order by m.created_at, m.id, o.created_at, o.id
  `)

  return toMenuList(result.rows)
}

export async function findMenu(menuId, client = pool) {
  const result = await client.query(
    `
      select id, name, description, price, image_url, stock_quantity
      from menus
      where id = $1
    `,
    [menuId],
  )

  if (result.rowCount === 0) {
    throw httpError(404, 'MENU_NOT_FOUND', 'Menu not found')
  }

  return result.rows[0]
}

export async function listInventory() {
  const result = await pool.query(`
    select id, name, stock_quantity
    from menus
    order by created_at, id
  `)

  return result.rows.map((menu) => ({
    menuId: menu.id,
    menuName: menu.name,
    stockQuantity: menu.stock_quantity,
  }))
}

export async function updateInventory(menuId, delta) {
  if (!Number.isInteger(delta)) {
    throw httpError(400, 'INVALID_DELTA', 'delta must be an integer')
  }

  const result = await pool.query(
    `
      update menus
      set stock_quantity = greatest(0, stock_quantity + $2),
          updated_at = now()
      where id = $1
      returning id, name, stock_quantity
    `,
    [menuId, delta],
  )

  if (result.rowCount === 0) {
    throw httpError(404, 'MENU_NOT_FOUND', 'Menu not found')
  }

  const menu = result.rows[0]

  return {
    menuId: menu.id,
    menuName: menu.name,
    stockQuantity: menu.stock_quantity,
  }
}

function toMenuList(rows) {
  const menuMap = new Map()

  rows.forEach((row) => {
    if (!menuMap.has(row.menu_id)) {
      menuMap.set(row.menu_id, {
        id: row.menu_id,
        name: row.menu_name,
        description: row.description,
        price: row.menu_price,
        imageUrl: row.image_url,
        stockQuantity: row.stock_quantity,
        options: [],
      })
    }

    if (row.option_id) {
      menuMap.get(row.menu_id).options.push({
        id: row.option_id,
        name: row.option_name,
        price: row.option_price,
      })
    }
  })

  return [...menuMap.values()]
}

export async function reduceStock(client, menuId, quantity) {
  const result = await client.query(
    `
      update menus
      set stock_quantity = stock_quantity - $2,
          updated_at = now()
      where id = $1 and stock_quantity >= $2
      returning id, name, stock_quantity
    `,
    [menuId, quantity],
  )

  if (result.rowCount === 0) {
    const menu = await findMenu(menuId, client)
    throw httpError(409, 'INSUFFICIENT_STOCK', `${menu.name} stock is insufficient`)
  }
}
