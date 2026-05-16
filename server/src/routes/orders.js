import { Router } from 'express'
import {
  createOrder,
  getOrderById,
  listOrders,
  updateOrderStatus,
} from '../services/orderService.js'

export const orderRouter = Router()

orderRouter.get('/', async (req, res, next) => {
  try {
    res.json({ orders: await listOrders() })
  } catch (err) {
    next(err)
  }
})

orderRouter.post('/', async (req, res, next) => {
  try {
    const order = await createOrder(req.body)
    res.status(201).json({ order })
  } catch (err) {
    next(err)
  }
})

orderRouter.get('/:orderId', async (req, res, next) => {
  try {
    res.json({ order: await getOrderById(req.params.orderId) })
  } catch (err) {
    next(err)
  }
})

orderRouter.patch('/:orderId/status', async (req, res, next) => {
  try {
    const order = await updateOrderStatus(req.params.orderId, req.body.status)
    res.json({ order })
  } catch (err) {
    next(err)
  }
})
