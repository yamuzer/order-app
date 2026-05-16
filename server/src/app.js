import express from 'express'
import cors from 'cors'
import { healthRouter } from './routes/health.js'
import { menuRouter } from './routes/menus.js'
import { orderRouter } from './routes/orders.js'
import { inventoryRouter } from './routes/inventory.js'
import { notFoundHandler, errorHandler } from './middleware/errors.js'

export function createApp() {
  const app = express()

  app.use(cors())
  app.use(express.json())

  app.get('/', (req, res) => {
    res.json({
      service: 'order-app-server',
      status: 'ok',
      endpoints: [
        'GET /health',
        'GET /api/menus',
        'POST /api/orders',
        'GET /api/orders',
        'GET /api/orders/:orderId',
        'PATCH /api/orders/:orderId/status',
        'GET /api/admin/inventory',
        'PATCH /api/admin/inventory/:menuId',
      ],
    })
  })

  app.use('/health', healthRouter)
  app.use('/api/menus', menuRouter)
  app.use('/api/orders', orderRouter)
  app.use('/api/admin/inventory', inventoryRouter)

  app.use(notFoundHandler)
  app.use(errorHandler)

  return app
}
