const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:4000'

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    const message = data.error?.message || '요청 처리 중 오류가 발생했습니다'
    throw new Error(message)
  }

  return data
}

export async function fetchMenus() {
  const data = await request('/api/menus')
  return data.menus
}

export async function fetchOrders() {
  const data = await request('/api/orders')
  return data.orders
}

export async function fetchInventory() {
  const data = await request('/api/admin/inventory')
  return data.items
}

export async function createOrder(payload) {
  const data = await request('/api/orders', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  return data.order
}

export async function patchOrderStatus(orderId, status) {
  const data = await request(`/api/orders/${orderId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })
  return data.order
}

export async function patchInventory(menuId, delta) {
  const data = await request(`/api/admin/inventory/${menuId}`, {
    method: 'PATCH',
    body: JSON.stringify({ delta }),
  })
  return data.item
}
