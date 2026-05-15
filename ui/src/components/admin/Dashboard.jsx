import { getDashboardSummary } from '../../utils/order'

function Dashboard({ orders }) {
  const summary = getDashboardSummary(orders)
  const cards = [
    { label: '총 주문', value: summary.total, tone: 'total' },
    { label: '주문 접수', value: summary.accepted, tone: 'accepted' },
    { label: '제조 중', value: summary.inProgress, tone: 'progress' },
    { label: '제조 완료', value: summary.completed, tone: 'completed' },
  ]

  return (
    <section className="admin-section">
      <h2 className="admin-section__title">관리자 대시보드</h2>
      <div className="dashboard-grid">
        {cards.map((card) => (
          <article key={card.label} className={`dashboard-card dashboard-card--${card.tone}`}>
            <span className="dashboard-card__label">{card.label}</span>
            <strong className="dashboard-card__value">{card.value}</strong>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Dashboard
