export function formatPrice(amount) {
  return `${amount.toLocaleString('ko-KR')}원`
}

export function getOptionKey(optionIds) {
  return [...optionIds].sort().join(',')
}

export function calcUnitPrice(menu, selectedOptions) {
  const optionsTotal = selectedOptions.reduce((sum, opt) => sum + opt.extraPrice, 0)
  return menu.price + optionsTotal
}

export function formatCartItemName(menuName, selectedOptions) {
  const optionPart =
    selectedOptions.length > 0
      ? ` (${selectedOptions.map((o) => o.name).join(', ')})`
      : ''
  return `${menuName}${optionPart}`
}

export function optionsMatch(a, b) {
  if (a.length !== b.length) return false
  const keyA = getOptionKey(a.map((o) => o.id))
  const keyB = getOptionKey(b.map((o) => o.id))
  return keyA === keyB
}
