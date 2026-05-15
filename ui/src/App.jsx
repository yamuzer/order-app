import { useState } from 'react'
import { StoreProvider } from './context/StoreContext'
import Header from './components/Header'
import OrderPage from './pages/OrderPage'
import AdminPage from './pages/AdminPage'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('order')

  return (
    <StoreProvider>
      <div className="app">
        <Header activeTab={activeTab} onTabChange={setActiveTab} />
        {activeTab === 'order' ? <OrderPage /> : <AdminPage />}
      </div>
    </StoreProvider>
  )
}

export default App
