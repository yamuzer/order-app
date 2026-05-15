export const MENUS = [
  {
    id: 'americano-ice',
    name: '아메리카노',
    price: 4000,
    description: '시원하고 깔끔한 아이스 아메리카노',
    imageUrl: '/images/americano.png',
    options: [
      { id: 'shot', name: '샷 추가', extraPrice: 500 },
      { id: 'syrup', name: '시럽 추가', extraPrice: 0 },
    ],
  },
  {
    id: 'americano-hot',
    name: '아메리카노(HOT)',
    price: 4000,
    description: '진한 에스프레소의 깊은 맛',
    imageUrl: '/images/americano-hot.png',
    options: [
      { id: 'shot', name: '샷 추가', extraPrice: 500 },
      { id: 'syrup', name: '시럽 추가', extraPrice: 0 },
    ],
  },
  {
    id: 'cafe-latte',
    name: '카페라떼',
    price: 5000,
    description: '부드러운 우유와 에스프레소의 조화',
    imageUrl: '/images/cafe-latte.png',
    options: [
      { id: 'shot', name: '샷 추가', extraPrice: 500 },
      { id: 'syrup', name: '시럽 추가', extraPrice: 0 },
    ],
  },
]
