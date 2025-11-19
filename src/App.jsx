import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { CartProvider, useCart } from './context/CartContext';
import Products from './pages/Products';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function Header({ token, setToken }) {
  const { cart } = useCart();
  const cartCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    window.location.href = '/login'; // redirect to login immediately
  };

  return (
    <header className="flex justify-between items-center bg-green-600 text-white px-6 py-4 shadow">
      <h1 className="text-2xl font-bold">🌿 Plant Shop</h1>
      <nav className="space-x-4">
        {location.pathname !== '/' && (
          <Link to="/" className="hover:underline">Products</Link>
        )}
        {location.pathname !== '/cart' && (
          <Link to="/cart" className="hover:underline">Cart ({cartCount})</Link>
        )}
        {!token ? (
          <>
            {location.pathname !== '/login' && <Link to="/login" className="hover:underline">Login</Link>}
            {location.pathname !== '/register' && <Link to="/register" className="hover:underline">Register</Link>}
          </>
        ) : (
          location.pathname === '/' && (
            <button onClick={handleLogout} className="hover:underline">Logout</button>
          )
        )}
      </nav>
    </header>
  );
}

function AppRoutes({ token, setToken }) {
  const { fetchCart } = useCart(); // to trigger fetchCart from Products/Cart

  return (
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
  );
}

function AppWrapper() {
  const [token, setToken] = React.useState(localStorage.getItem('token'));

  return (
    <CartProvider>
      <Router>
        <Header token={token} setToken={setToken} />
        <main className="p-6">
          <AppRoutes token={token} setToken={setToken} />
        </main>
      </Router>
    </CartProvider>
  );
}

export default AppWrapper;
