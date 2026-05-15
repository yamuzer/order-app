import { MENUS } from '../../data/menus'
import { getStockStatus } from '../../utils/order'

function InventorySection({ inventory, onUpdateInventory }) {
  return (
    <section className="admin-section">
      <h2 className="admin-section__title">재고 현황</h2>
      <div className="inventory-grid">
        {MENUS.map((menu) => {
          const stock = inventory[menu.id] ?? 0
          const status = getStockStatus(stock)
          return (
            <article key={menu.id} className="inventory-card">
              <h3 className="inventory-card__name">{menu.name}</h3>
              <p className="inventory-card__stock">{stock}개</p>
              <span className={`inventory-card__status inventory-card__status--${status.level}`}>
                {status.label}
              </span>
              <div className="inventory-card__controls">
                <button
                  type="button"
                  className="inventory-card__btn"
                  aria-label={`${menu.name} 재고 줄이기`}
                  onClick={() => onUpdateInventory(menu.id, -1)}
                >
                  −
                </button>
                <button
                  type="button"
                  className="inventory-card__btn"
                  aria-label={`${menu.name} 재고 늘리기`}
                  onClick={() => onUpdateInventory(menu.id, 1)}
                >
                  +
                </button>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default InventorySection
