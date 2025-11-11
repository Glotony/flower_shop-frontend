// src/App.jsx
import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Products from './pages/Products'
import Cart from './pages/Cart'
import { getCart } from './api'
import './App.css'

function App() {
  const [cart, setCart] = useState([])

  // Fetch cart for nav count
  const fetchCart = async () => {
    try {
      const data = await getCart()
      setCart(data)
    } catch (err) {
      console.error('Error fetching cart:', err)
    }
  }

  useEffect(() => {
    fetchCart()
  }, [])

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0)

  return (
    <Router>
      <header>
        <h1>🌿 Plant Shop</h1>
        <nav>
          <Link to="/">Products</Link> |{' '}
          <Link to="/cart">Cart ({cartCount})</Link>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Products onAddToCart={fetchCart} />} />
          <Route path="/cart" element={<Cart onUpdateCart={fetchCart} />} />
        </Routes>
      </main>
    </Router>
  )
}

export default App
