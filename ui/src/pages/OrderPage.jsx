import { useState, useMemo } from 'react'
import { MENUS } from '../data/menus'
import { calcUnitPrice, getOptionKey } from '../utils/cart'
import { useStore } from '../context/useStore'
import MenuCard from '../components/MenuCard'
import Cart from '../components/Cart'

function createEmptySelections() {
  return Object.fromEntries(MENUS.map((m) => [m.id, []]))
}

function OrderPage() {
  const { addOrder } = useStore()
  const [optionSelections, setOptionSelections] = useState(createEmptySelections)
  const [cartItems, setCartItems] = useState([])
  const [message, setMessage] = useState('')

  const totalAmount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.lineTotal, 0),
    [cartItems],
  )

  function handleToggleOption(menuId, optionId) {
    setOptionSelections((prev) => {
      const current = prev[menuId] || []
      const next = current.includes(optionId)
        ? current.filter((id) => id !== optionId)
        : [...current, optionId]
      return { ...prev, [menuId]: next }
    })
  }

  function handleAddToCart(menu) {
    const selectedIds = optionSelections[menu.id] || []
    const selectedOptions = menu.options.filter((o) => selectedIds.includes(o.id))
    const unitPrice = calcUnitPrice(menu, selectedOptions)
    const optionKey = getOptionKey(selectedIds)

    setCartItems((prev) => {
      const existing = prev.find(
        (item) => item.menuId === menu.id && item.optionKey === optionKey,
      )
      if (existing) {
        return prev.map((item) =>
          item.key === existing.key
            ? {
                ...item,
                quantity: item.quantity + 1,
                lineTotal: (item.quantity + 1) * item.unitPrice,
              }
            : item,
        )
      }
      return [
        ...prev,
        {
          key: `${menu.id}-${optionKey}`,
          menuId: menu.id,
          menuName: menu.name,
          optionKey,
          selectedOptions,
          quantity: 1,
          unitPrice,
          lineTotal: unitPrice,
        },
      ]
    })
    setMessage('')
  }

  function handleQuantityChange(itemKey, delta) {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.key !== itemKey) return item
          const quantity = item.quantity + delta
          if (quantity <= 0) return null
          return {
            ...item,
            quantity,
            lineTotal: quantity * item.unitPrice,
          }
        })
        .filter(Boolean),
    )
    setMessage('')
  }

  function handleOrder() {
    if (cartItems.length === 0) {
      setMessage('담은 메뉴가 없습니다')
      return
    }
    addOrder(cartItems, totalAmount)
    setMessage('주문이 완료되었습니다!')
    setCartItems([])
  }

  return (
    <main className="order-page">
      <section className="menu-section">
        <div className="menu-grid">
          {MENUS.map((menu) => (
            <MenuCard
              key={menu.id}
              menu={menu}
              selectedOptionIds={optionSelections[menu.id] || []}
              onToggleOption={handleToggleOption}
              onAddToCart={() => handleAddToCart(menu)}
            />
          ))}
        </div>
      </section>
      <Cart
        items={cartItems}
        totalAmount={totalAmount}
        onOrder={handleOrder}
        onQuantityChange={handleQuantityChange}
      />
      {message && (
        <p className="toast" role="status">
          {message}
        </p>
      )}
    </main>
  )
}

export default OrderPage
