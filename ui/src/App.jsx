import { useState } from 'react'
import Header from './components/Header'
import OrderPage from './pages/OrderPage'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('order')

  return (
    <div className="app">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      {activeTab === 'order' ? (
        <OrderPage />
      ) : (
        <main className="placeholder-page">
          <p>관리자 화면은 준비 중입니다.</p>
        </main>
      )}
    </div>
  )
}

export default App
