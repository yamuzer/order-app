import { formatCartItemName } from './cart'

export const ORDER_STATUS = {
  PLACED: 'PLACED',
  ACCEPTED: 'ACCEPTED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
}

export const ORDER_STATUS_LABEL = {
  PLACED: '대기',
  ACCEPTED: '주문 접수',
  IN_PROGRESS: '제조 중',
  COMPLETED: '제조 완료',
}

export const NEXT_ACTION = {
  PLACED: { label: '주문 접수', next: ORDER_STATUS.ACCEPTED },
  ACCEPTED: { label: '제조 시작', next: ORDER_STATUS.IN_PROGRESS },
  IN_PROGRESS: { label: '제조 완료', next: ORDER_STATUS.COMPLETED },
}

export function formatOrderDate(isoString) {
  const date = new Date(isoString)
  return date.toLocaleString('ko-KR', {
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

export function formatOrderItemLine(item) {
  const name = formatCartItemName(item.menuName, item.selectedOptions)
  return `${name} x ${item.quantity}`
}

export function getStockStatus(stock) {
  if (stock === 0) return { label: '품절', level: 'soldout' }
  if (stock < 5) return { label: '주의', level: 'warning' }
  return { label: '정상', level: 'normal' }
}

export function getDashboardSummary(orders) {
  return {
    total: orders.length,
    accepted: orders.filter((o) => o.status === ORDER_STATUS.ACCEPTED).length,
    inProgress: orders.filter((o) => o.status === ORDER_STATUS.IN_PROGRESS).length,
    completed: orders.filter((o) => o.status === ORDER_STATUS.COMPLETED).length,
  }
}
