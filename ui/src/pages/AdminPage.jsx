import { useStore } from '../context/useStore'
import Dashboard from '../components/admin/Dashboard'
import InventorySection from '../components/admin/InventorySection'
import OrderSection from '../components/admin/OrderSection'

function AdminPage() {
  const { orders, inventory, updateOrderStatus, updateInventory } = useStore()

  return (
    <main className="admin-page">
      <Dashboard orders={orders} />
      <InventorySection inventory={inventory} onUpdateInventory={updateInventory} />
      <OrderSection orders={orders} onUpdateOrderStatus={updateOrderStatus} />
    </main>
  )
}

export default AdminPage
