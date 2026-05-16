import { useStore } from '../context/useStore'
import Dashboard from '../components/admin/Dashboard'
import InventorySection from '../components/admin/InventorySection'
import OrderSection from '../components/admin/OrderSection'

function AdminPage() {
  const {
    error,
    inventory,
    isLoading,
    orders,
    updateInventory,
    updateOrderStatus,
  } = useStore()

  return (
    <main className="admin-page">
      {isLoading && <p className="page-state">관리자 데이터를 불러오는 중입니다</p>}
      {error && <p className="page-state page-state--error">{error}</p>}
      <Dashboard orders={orders} />
      <InventorySection inventory={inventory} onUpdateInventory={updateInventory} />
      <OrderSection orders={orders} onUpdateOrderStatus={updateOrderStatus} />
    </main>
  )
}

export default AdminPage
