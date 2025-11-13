import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Products from './pages/Products';
import Cart from './pages/Cart';
import Register from './pages/register';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import { getCart } from './api';
import './App.css';

function App() {
  const [cart, setCart] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('token'));

  const fetchCart = async () => {
    if (!token) return setCart([]);
    try {
      const data = await getCart();
      setCart(data || []);
    } catch (err) {
      console.error('Failed to fetch cart:', err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [token]);

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
          {!token ? (
            <>
              <Link to="/login" className="hover:underline">
                Login
              </Link>
              <Link to="/register" className="hover:underline">
                Register
              </Link>
            </>
          ) : (
            <button
              onClick={() => {
                localStorage.removeItem('token');
                setToken(null);
              }}
              className="hover:underline"
            >
              Logout
            </button>
          )}
        </nav>
      </header>

      <main className="p-6">
        <Routes>
          <Route path="/" element={<Products onAddToCart={fetchCart} />} />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart onUpdateCart={fetchCart} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/login"
            element={token ? <Navigate to="/" /> : <Login onLogin={() => setToken(localStorage.getItem('token'))} />}
          />
          <Route
            path="/register"
            element={token ? <Navigate to="/" /> : <Register />}
          />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
