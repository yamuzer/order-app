import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  createOrder,
  fetchInventory,
  fetchMenus,
  fetchOrders,
  patchInventory,
  patchOrderStatus,
} from '../api/client'
import { StoreContext } from './storeContextValue'

export function StoreProvider({ children }) {
  const [menus, setMenus] = useState([])
  const [orders, setOrders] = useState([])
  const [inventory, setInventory] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const refreshAdminData = useCallback(async () => {
    const [nextOrders, nextInventory] = await Promise.all([
      fetchOrders(),
      fetchInventory(),
    ])

    setOrders(nextOrders.map(normalizeOrder))
    setInventory(nextInventory)
  }, [])

  const loadStore = useCallback(async () => {
    setIsLoading(true)
    setError('')

    try {
      const [nextMenus, nextOrders, nextInventory] = await Promise.all([
        fetchMenus(),
        fetchOrders(),
        fetchInventory(),
      ])

      setMenus(nextMenus.map(normalizeMenu))
      setOrders(nextOrders.map(normalizeOrder))
      setInventory(nextInventory)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    let ignore = false

    async function loadInitialStore() {
      try {
        const [nextMenus, nextOrders, nextInventory] = await Promise.all([
          fetchMenus(),
          fetchOrders(),
          fetchInventory(),
        ])

        if (ignore) return

        setMenus(nextMenus.map(normalizeMenu))
        setOrders(nextOrders.map(normalizeOrder))
        setInventory(nextInventory)
        setError('')
      } catch (err) {
        if (!ignore) {
          setError(err.message)
        }
      } finally {
        if (!ignore) {
          setIsLoading(false)
        }
      }
    }

    loadInitialStore()

    return () => {
      ignore = true
    }
  }, [])

  const addOrder = useCallback(async (cartItems) => {
    try {
      const payload = {
        items: cartItems.map((item) => ({
          menuId: item.menuId,
          quantity: item.quantity,
          optionIds: item.selectedOptions.map((option) => option.id),
        })),
      }

      const order = normalizeOrder(await createOrder(payload))
      await refreshAdminData()
      setError('')
      return order
    } catch (err) {
      setError(err.message)
      throw err
    }
  }, [refreshAdminData])

  const updateOrderStatus = useCallback(async (orderId, status) => {
    try {
      const order = normalizeOrder(await patchOrderStatus(orderId, status))
      setOrders((prev) =>
        prev.map((current) => (current.id === orderId ? order : current)),
      )
      setError('')
      return order
    } catch (err) {
      setError(err.message)
      return null
    }
  }, [])

  const updateInventory = useCallback(async (menuId, delta) => {
    try {
      const item = await patchInventory(menuId, delta)
      setInventory((prev) =>
        prev.map((current) => (current.menuId === menuId ? item : current)),
      )
      setError('')
      return item
    } catch (err) {
      setError(err.message)
      return null
    }
  }, [])

  const value = useMemo(
    () => ({
      menus,
      orders,
      inventory,
      isLoading,
      error,
      addOrder,
      refresh: loadStore,
      updateOrderStatus,
      updateInventory,
    }),
    [
      addOrder,
      error,
      inventory,
      isLoading,
      loadStore,
      menus,
      orders,
      updateInventory,
      updateOrderStatus,
    ],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

function normalizeMenu(menu) {
  return {
    ...menu,
    options: menu.options.map((option) => ({
      id: option.id,
      name: option.name,
      extraPrice: option.price,
    })),
  }
}

function normalizeOrder(order) {
  return {
    ...order,
    createdAt: order.orderedAt,
    items: order.items.map((item) => ({
      ...item,
      selectedOptions: item.options.map((option) => ({
        id: option.optionId,
        name: option.optionName,
        extraPrice: option.optionPrice,
      })),
    })),
  }
}
