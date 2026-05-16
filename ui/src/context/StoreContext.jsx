import { useCallback, useMemo, useState } from 'react'
import { MENUS } from '../data/menus'
import { ORDER_STATUS } from '../utils/order'
import { StoreContext } from './storeContextValue'

function createInitialInventory() {
  return Object.fromEntries(MENUS.map((m) => [m.id, 10]))
}

export function StoreProvider({ children }) {
  const [orders, setOrders] = useState([])
  const [inventory, setInventory] = useState(createInitialInventory)

  const addOrder = useCallback((cartItems, totalAmount) => {
    const order = {
      id: `order-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      createdAt: new Date().toISOString(),
      items: cartItems.map((item) => ({
        menuId: item.menuId,
        menuName: item.menuName,
        selectedOptions: item.selectedOptions,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })),
      totalAmount,
      status: ORDER_STATUS.PLACED,
    }
    setOrders((prev) => [order, ...prev])
    return order
  }, [])

  const updateOrderStatus = useCallback((orderId, status) => {
    const orderToComplete = orders.find(
      (order) =>
        order.id === orderId &&
        order.status !== ORDER_STATUS.COMPLETED &&
        status === ORDER_STATUS.COMPLETED,
    )

    setOrders((prev) =>
      prev.map((order) => (order.id === orderId ? { ...order, status } : order)),
    )

    if (orderToComplete) {
      setInventory((prev) => {
        const next = { ...prev }

        orderToComplete.items.forEach((item) => {
          next[item.menuId] = Math.max(0, (next[item.menuId] ?? 0) - item.quantity)
        })

        return next
      })
    }
  }, [orders])

  const updateInventory = useCallback((menuId, delta) => {
    setInventory((prev) => ({
      ...prev,
      [menuId]: Math.max(0, (prev[menuId] ?? 0) + delta),
    }))
  }, [])

  const value = useMemo(
    () => ({
      orders,
      inventory,
      addOrder,
      updateOrderStatus,
      updateInventory,
    }),
    [addOrder, inventory, orders, updateInventory, updateOrderStatus],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}
