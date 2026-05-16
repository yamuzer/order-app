import { useMemo, useState } from 'react'
import { calcUnitPrice, getOptionKey } from '../utils/cart'
import { useStore } from '../context/useStore'
import MenuCard from '../components/MenuCard'
import Cart from '../components/Cart'

function OrderPage() {
  const { addOrder, error, isLoading, menus } = useStore()
  const [optionSelections, setOptionSelections] = useState({})
  const [cartItems, setCartItems] = useState([])
  const [message, setMessage] = useState('')
  const [isOrdering, setIsOrdering] = useState(false)

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

  async function handleOrder() {
    if (cartItems.length === 0) {
      setMessage('담은 메뉴가 없습니다')
      return
    }

    setIsOrdering(true)
    setMessage('')

    try {
      await addOrder(cartItems)
      setMessage('주문이 완료되었습니다!')
      setCartItems([])
    } catch (err) {
      setMessage(err.message)
    } finally {
      setIsOrdering(false)
    }
  }

  return (
    <main className="order-page">
      <section className="menu-section">
        {isLoading ? (
          <p className="page-state">메뉴를 불러오는 중입니다</p>
        ) : error ? (
          <p className="page-state page-state--error">{error}</p>
        ) : menus.length === 0 ? (
          <p className="page-state">등록된 메뉴가 없습니다</p>
        ) : (
          <div className="menu-grid">
            {menus.map((menu) => (
              <MenuCard
                key={menu.id}
                menu={menu}
                selectedOptionIds={optionSelections[menu.id] || []}
                onToggleOption={handleToggleOption}
                onAddToCart={() => handleAddToCart(menu)}
              />
            ))}
          </div>
        )}
      </section>
      <Cart
        items={cartItems}
        totalAmount={totalAmount}
        onOrder={handleOrder}
        onQuantityChange={handleQuantityChange}
        isOrdering={isOrdering}
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
