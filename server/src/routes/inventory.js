import { Router } from 'express'
import { listInventory, updateInventory } from '../services/menuService.js'

export const inventoryRouter = Router()

inventoryRouter.get('/', async (req, res, next) => {
  try {
    res.json({ items: await listInventory() })
  } catch (err) {
    next(err)
  }
})

inventoryRouter.patch('/:menuId', async (req, res, next) => {
  try {
    const item = await updateInventory(req.params.menuId, req.body.delta)
    res.json({ item })
  } catch (err) {
    next(err)
  }
})
