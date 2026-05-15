import { formatPrice } from '../../utils/cart'
import {
  formatOrderDate,
  formatOrderItemLine,
  ORDER_STATUS_LABEL,
  NEXT_ACTION,
} from '../../utils/order'

function OrderSection({ orders, onUpdateOrderStatus }) {
  const activeOrders = [...orders].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  )

  return (
    <section className="admin-section">
      <h2 className="admin-section__title">주문 현황</h2>
      {activeOrders.length === 0 ? (
        <p className="order-list__empty">접수된 주문이 없습니다</p>
      ) : (
        <ul className="order-list">
          {activeOrders.map((order) => {
            const action = NEXT_ACTION[order.status]
            return (
              <li key={order.id} className="order-row">
                <div className="order-row__info">
                  <div className="order-row__header">
                    <time className="order-row__time" dateTime={order.createdAt}>
                      {formatOrderDate(order.createdAt)}
                    </time>
                    <span className={`order-row__badge order-row__badge--${order.status.toLowerCase()}`}>
                      {ORDER_STATUS_LABEL[order.status]}
                    </span>
                  </div>
                  <ul className="order-row__items">
                    {order.items.map((item, idx) => (
                      <li key={idx}>{formatOrderItemLine(item)}</li>
                    ))}
                  </ul>
                </div>
                <div className="order-row__side">
                  <p className="order-row__amount">{formatPrice(order.totalAmount)}</p>
                  {action && (
                    <button
                      type="button"
                      className="btn btn--primary order-row__action"
                      onClick={() => onUpdateOrderStatus(order.id, action.next)}
                    >
                      {action.label}
                    </button>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}

export default OrderSection
