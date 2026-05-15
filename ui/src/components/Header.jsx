function Header({ activeTab, onTabChange }) {
  return (
    <header className="header">
      <h1 className="brand">COZY</h1>
      <nav className="nav">
        <button
          type="button"
          className={`nav-tab ${activeTab === 'order' ? 'nav-tab--active' : ''}`}
          onClick={() => onTabChange('order')}
        >
          주문하기
        </button>
        <button
          type="button"
          className={`nav-tab ${activeTab === 'admin' ? 'nav-tab--active' : ''}`}
          onClick={() => onTabChange('admin')}
        >
          관리자
        </button>
      </nav>
    </header>
  )
}

export default Header
