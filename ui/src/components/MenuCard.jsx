import { formatPrice } from '../utils/cart'

function MenuCard({ menu, selectedOptionIds, onToggleOption, onAddToCart }) {
  return (
    <article className="menu-card">
      <div className="menu-card__image">
        <img src={menu.imageUrl} alt={menu.name} className="menu-card__img" />
      </div>
      <h3 className="menu-card__name">{menu.name}</h3>
      <p className="menu-card__price">{formatPrice(menu.price)}</p>
      <p className="menu-card__desc">{menu.description}</p>
      <ul className="menu-card__options">
        {menu.options.map((option) => (
          <li key={option.id}>
            <label className="menu-card__option">
              <input
                type="checkbox"
                checked={selectedOptionIds.includes(option.id)}
                onChange={() => onToggleOption(menu.id, option.id)}
              />
              <span>
                {option.name} (+{formatPrice(option.extraPrice)})
              </span>
            </label>
          </li>
        ))}
      </ul>
      <button type="button" className="btn btn--primary menu-card__add" onClick={onAddToCart}>
        담기
      </button>
    </article>
  )
}

export default MenuCard
