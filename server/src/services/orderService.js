import { pool } from '../db/pool.js'
import { reduceStock } from './menuService.js'
import { httpError } from './errors.js'

const ORDER_STATUS = {
  ACCEPTED: 'ACCEPTED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
}

const STATUS_LABEL = {
  ACCEPTED: '주문 접수',
  IN_PROGRESS: '제조 중',
  COMPLETED: '완료',
}

const NEXT_STATUS = {
  ACCEPTED: ORDER_STATUS.IN_PROGRESS,
  IN_PROGRESS: ORDER_STATUS.COMPLETED,
}

export async function listOrders() {
  const result = await pool.query(orderSelectSql())
  return toOrders(result.rows)
}

export async function getOrderById(orderId, client = pool) {
  const result = await client.query(orderSelectSql('where o.id = $1'), [orderId])
  const [order] = toOrders(result.rows)

  if (!order) {
    throw httpError(404, 'ORDER_NOT_FOUND', 'Order not found')
  }

  return order
}

export async function createOrder(payload) {
  const items = validateOrderItems(payload?.items)
  const client = await pool.connect()

  try {
    await client.query('begin')

    const orderItems = []
    const stockByMenu = new Map()

    for (const item of items) {
      const orderItem = await buildOrderItem(client, item)
      orderItems.push(orderItem)
      stockByMenu.set(item.menuId, (stockByMenu.get(item.menuId) || 0) + item.quantity)
    }

    for (const [menuId, quantity] of stockByMenu.entries()) {
      await reduceStock(client, menuId, quantity)
    }

    const totalAmount = orderItems.reduce((sum, item) => sum + item.lineAmount, 0)
    const orderId = createId('order')
    const orderedAt = new Date()

    await client.query(
      `
        insert into orders (id, ordered_at, status, total_amount)
        values ($1, $2, $3, $4)
      `,
      [orderId, orderedAt, ORDER_STATUS.ACCEPTED, totalAmount],
    )

    for (const item of orderItems) {
      await client.query(
        `
          insert into order_items (
            id, order_id, menu_id, menu_name, quantity, unit_price, line_amount
          )
          values ($1, $2, $3, $4, $5, $6, $7)
        `,
        [
          item.id,
          orderId,
          item.menuId,
          item.menuName,
          item.quantity,
          item.unitPrice,
          item.lineAmount,
        ],
      )

      for (const option of item.options) {
        await client.query(
          `
            insert into order_item_options (
              id, order_item_id, option_id, option_name, option_price
            )
            values ($1, $2, $3, $4, $5)
          `,
          [
            createId('order-option'),
            item.id,
            option.optionId,
            option.optionName,
            option.optionPrice,
          ],
        )
      }
    }

    await client.query('commit')
    return getOrderById(orderId)
  } catch (err) {
    await client.query('rollback')
    throw err
  } finally {
    client.release()
  }
}

export async function updateOrderStatus(orderId, status) {
  const current = await getOrderById(orderId)
  const expectedNext = NEXT_STATUS[current.status]

  if (!expectedNext || status !== expectedNext) {
    throw httpError(400, 'INVALID_STATUS_TRANSITION', 'Invalid order status transition')
  }

  const result = await pool.query(
    `
      update orders
      set status = $2,
          updated_at = now()
      where id = $1
      returning id
    `,
    [orderId, status],
  )

  if (result.rowCount === 0) {
    throw httpError(404, 'ORDER_NOT_FOUND', 'Order not found')
  }

  return getOrderById(orderId)
}

function validateOrderItems(items) {
  if (!Array.isArray(items) || items.length === 0) {
    throw httpError(400, 'INVALID_ORDER_ITEMS', 'items must contain at least one item')
  }

  return items.map((item) => {
    if (!item || typeof item.menuId !== 'string') {
      throw httpError(400, 'INVALID_MENU_ID', 'menuId is required')
    }

    if (!Number.isInteger(item.quantity) || item.quantity < 1) {
      throw httpError(400, 'INVALID_QUANTITY', 'quantity must be an integer greater than 0')
    }

    const optionIds = item.optionIds ?? []
    if (!Array.isArray(optionIds) || optionIds.some((id) => typeof id !== 'string')) {
      throw httpError(400, 'INVALID_OPTIONS', 'optionIds must be an array of strings')
    }

    if (new Set(optionIds).size !== optionIds.length) {
      throw httpError(400, 'DUPLICATE_OPTIONS', 'optionIds must not contain duplicates')
    }

    return {
      menuId: item.menuId,
      quantity: item.quantity,
      optionIds,
    }
  })
}

async function buildOrderItem(client, item) {
  const menuResult = await client.query(
    `
      select id, name, price
      from menus
      where id = $1
    `,
    [item.menuId],
  )

  if (menuResult.rowCount === 0) {
    throw httpError(404, 'MENU_NOT_FOUND', 'Menu not found')
  }

  const menu = menuResult.rows[0]
  const options = await findOptionsForMenu(client, menu.id, item.optionIds)
  const unitPrice = menu.price + options.reduce((sum, option) => sum + option.optionPrice, 0)

  return {
    id: createId('order-item'),
    menuId: menu.id,
    menuName: menu.name,
    quantity: item.quantity,
    unitPrice,
    lineAmount: unitPrice * item.quantity,
    options,
  }
}

async function findOptionsForMenu(client, menuId, optionIds) {
  if (optionIds.length === 0) return []

  const result = await client.query(
    `
      select id, name, price
      from options
      where menu_id = $1 and id = any($2::text[])
      order by created_at, id
    `,
    [menuId, optionIds],
  )

  if (result.rowCount !== optionIds.length) {
    throw httpError(400, 'INVALID_OPTION_FOR_MENU', 'Option does not belong to selected menu')
  }

  return result.rows.map((option) => ({
    optionId: option.id,
    optionName: option.name,
    optionPrice: option.price,
  }))
}

function orderSelectSql(whereClause = '') {
  return `
    select
      o.id as order_id,
      o.ordered_at,
      o.status,
      o.total_amount,
      oi.id as order_item_id,
      oi.menu_id,
      oi.menu_name,
      oi.quantity,
      oi.unit_price,
      oi.line_amount,
      oio.id as order_item_option_id,
      oio.option_id,
      oio.option_name,
      oio.option_price
    from orders o
    left join order_items oi on oi.order_id = o.id
    left join order_item_options oio on oio.order_item_id = oi.id
    ${whereClause}
    order by o.ordered_at desc, o.id, oi.id, oio.id
  `
}

function toOrders(rows) {
  const orderMap = new Map()

  rows.forEach((row) => {
    if (!orderMap.has(row.order_id)) {
      orderMap.set(row.order_id, {
        id: row.order_id,
        orderedAt: row.ordered_at,
        status: row.status,
        statusLabel: STATUS_LABEL[row.status],
        totalAmount: row.total_amount,
        items: [],
      })
    }

    if (!row.order_item_id) return

    const order = orderMap.get(row.order_id)
    let item = order.items.find((candidate) => candidate.id === row.order_item_id)

    if (!item) {
      item = {
        id: row.order_item_id,
        menuId: row.menu_id,
        menuName: row.menu_name,
        quantity: row.quantity,
        unitPrice: row.unit_price,
        lineAmount: row.line_amount,
        options: [],
      }
      order.items.push(item)
    }

    if (row.order_item_option_id) {
      item.options.push({
        optionId: row.option_id,
        optionName: row.option_name,
        optionPrice: row.option_price,
      })
    }
  })

  return [...orderMap.values()]
}

function createId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}
