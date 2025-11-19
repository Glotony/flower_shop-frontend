import { createContext, useContext, useState, useEffect } from 'react';
import { getCart } from '../api';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Fetch cart initially
  const fetchCart = async () => {
    try {
      const data = await getCart();
      setCart(data || []);
    } catch (err) {
      console.error('Failed to fetch cart:', err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return; //  <-- FIXED: do not fetch cart without token
    fetchCart();
  }, []);

  return (
    <CartContext.Provider value={{ cart, setCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

// Hook for convenience
export const useCart = () => useContext(CartContext);
