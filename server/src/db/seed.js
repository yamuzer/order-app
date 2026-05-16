import 'dotenv/config'
import { pool } from './pool.js'

const menus = [
  {
    id: 'americano-ice',
    name: '아메리카노',
    description: '시원하고 깔끔한 아이스 아메리카노',
    price: 4000,
    imageUrl: '/images/americano.png',
    stockQuantity: 10,
    options: [
      { id: 'americano-ice-shot', name: '샷 추가', price: 500 },
      { id: 'americano-ice-syrup', name: '시럽 추가', price: 0 },
    ],
  },
  {
    id: 'americano-hot',
    name: '아메리카노(HOT)',
    description: '진한 에스프레소의 깊은 맛',
    price: 4000,
    imageUrl: '/images/americano-hot.png',
    stockQuantity: 10,
    options: [
      { id: 'americano-hot-shot', name: '샷 추가', price: 500 },
      { id: 'americano-hot-syrup', name: '시럽 추가', price: 0 },
    ],
  },
  {
    id: 'cafe-latte',
    name: '카페라떼',
    description: '부드러운 우유와 에스프레소의 조화',
    price: 5000,
    imageUrl: '/images/cafe-latte.png',
    stockQuantity: 10,
    options: [
      { id: 'cafe-latte-shot', name: '샷 추가', price: 500 },
      { id: 'cafe-latte-syrup', name: '시럽 추가', price: 0 },
    ],
  },
]

const client = await pool.connect()

try {
  await client.query('begin')

  for (const menu of menus) {
    await client.query(
      `
        insert into menus (id, name, description, price, image_url, stock_quantity)
        values ($1, $2, $3, $4, $5, $6)
        on conflict (id) do update set
          name = excluded.name,
          description = excluded.description,
          price = excluded.price,
          image_url = excluded.image_url,
          stock_quantity = greatest(menus.stock_quantity, excluded.stock_quantity),
          updated_at = now()
      `,
      [menu.id, menu.name, menu.description, menu.price, menu.imageUrl, menu.stockQuantity],
    )

    for (const option of menu.options) {
      await client.query(
        `
          insert into options (id, menu_id, name, price)
          values ($1, $2, $3, $4)
          on conflict (id) do update set
            menu_id = excluded.menu_id,
            name = excluded.name,
            price = excluded.price,
            updated_at = now()
        `,
        [option.id, menu.id, option.name, option.price],
      )
    }
  }

  await client.query('commit')
  console.log('Seed data is ready')
} catch (err) {
  await client.query('rollback')
  throw err
} finally {
  client.release()
  await pool.end()
}
