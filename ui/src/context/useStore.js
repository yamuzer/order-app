import { useContext } from 'react'
import { StoreContext } from './storeContextValue'

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
