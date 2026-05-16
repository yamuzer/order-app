export const menus = [
  {
    id: 'americano-ice',
    name: '아메리카노',
    description: '시원하고 깔끔한 아이스 아메리카노',
    price: 4000,
    imageUrl: '/images/americano.png',
    stockQuantity: 10,
    options: [
      { id: 'americano-ice-shot', name: '샷 추가', price: 500 },
      { id: 'americano-ice-syrup', name: '시럽 추가', price: 0 },
    ],
  },
  {
    id: 'americano-hot',
    name: '아메리카노(HOT)',
    description: '진한 에스프레소의 깊은 맛',
    price: 4000,
    imageUrl: '/images/americano-hot.png',
    stockQuantity: 10,
    options: [
      { id: 'americano-hot-shot', name: '샷 추가', price: 500 },
      { id: 'americano-hot-syrup', name: '시럽 추가', price: 0 },
    ],
  },
  {
    id: 'cafe-latte',
    name: '카페라떼',
    description: '부드러운 우유와 에스프레소의 조화',
    price: 5000,
    imageUrl: '/images/cafe-latte.png',
    stockQuantity: 10,
    options: [
      { id: 'cafe-latte-shot', name: '샷 추가', price: 500 },
      { id: 'cafe-latte-syrup', name: '시럽 추가', price: 0 },
    ],
  },
]

export const orders = []
