// src/App.jsx
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Products from './pages/Products';
import Cart from './pages/Cart';
import { getCart } from './api';
import './App.css';

function App() {
  const [cart, setCart] = useState([]);

  const fetchCart = async () => {
    try {
      const data = await getCart();
      setCart(data || []);
    } catch (err) {
      console.error('Failed to fetch cart:', err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const cartCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  return (
    <Router>
      <header className="flex justify-between items-center bg-green-600 text-white px-6 py-4 shadow">
        <h1 className="text-2xl font-bold">🌿 Plant Shop</h1>
        <nav className="space-x-4">
          <Link to="/" className="hover:underline">
            Products
          </Link>
          <Link to="/cart" className="hover:underline">
            Cart ({cartCount})
          </Link>
        </nav>
      </header>

      <main className="p-6">
        <Routes>
          <Route path="/" element={<Products onAddToCart={fetchCart} />} />
          <Route path="/cart" element={<Cart onUpdateCart={fetchCart} />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
