import { formatPrice, formatCartItemName } from '../utils/cart'

function Cart({ items, totalAmount, onOrder, onQuantityChange, isOrdering = false }) {
  const isEmpty = items.length === 0

  return (
    <section className="cart">
      <h2 className="cart__title">장바구니</h2>
      <div className="cart__body">
        <div className="cart__orders">
          <ul className={`cart__list ${isEmpty ? 'cart__list--empty' : ''}`}>
            {isEmpty ? (
              <li className="cart__empty">담은 메뉴가 없습니다</li>
            ) : (
              items.map((item) => (
                <li key={item.key} className="cart__item">
                  <span className="cart__item-label">
                    {formatCartItemName(item.menuName, item.selectedOptions)}
                  </span>
                  <div className="cart__qty">
                    <button
                      type="button"
                      className="cart__qty-btn"
                      aria-label="수량 줄이기"
                      onClick={() => onQuantityChange(item.key, -1)}
                    >
                      −
                    </button>
                    <span className="cart__qty-value">{item.quantity}</span>
                    <button
                      type="button"
                      className="cart__qty-btn"
                      aria-label="수량 늘리기"
                      onClick={() => onQuantityChange(item.key, 1)}
                    >
                      +
                    </button>
                  </div>
                  <span className="cart__item-price">{formatPrice(item.lineTotal)}</span>
                </li>
              ))
            )}
          </ul>
        </div>
        <div className="cart__summary">
          <p className="cart__total">
            총 금액 <strong>{formatPrice(totalAmount)}</strong>
          </p>
          <button
            type="button"
            className="btn btn--primary btn--order"
            disabled={isEmpty || isOrdering}
            onClick={onOrder}
          >
            {isOrdering ? '주문 중' : '주문하기'}
          </button>
        </div>
      </div>
    </section>
  )
}

export default Cart
