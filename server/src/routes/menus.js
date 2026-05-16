import { Router } from 'express'
import { listMenus } from '../services/menuService.js'

export const menuRouter = Router()

menuRouter.get('/', async (req, res, next) => {
  try {
    res.json({ menus: await listMenus() })
  } catch (err) {
    next(err)
  }
})
