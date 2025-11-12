// src/pages/Cart.jsx
import { useEffect, useState } from 'react';
import { getCart, updateCartItem, removeFromCart, clearCart, placeOrder } from '../api';

export default function Cart({ onUpdateCart }) {
  const [cart, setCart] = useState([]);

  const fetchCartData = async () => {
    try {
      const data = await getCart();
      setCart(data || []);
      if (onUpdateCart) onUpdateCart(); // update header cart count
    } catch (err) {
      console.error('Error fetching cart:', err);
    }
  };

  useEffect(() => {
    fetchCartData();
  }, [onUpdateCart]);

  const handleRemove = async (id) => {
    try {
      await removeFromCart(id);
      fetchCartData();
    } catch (err) {
      console.error('Error removing from cart:', err);
    }
  };

  const handleQuantityChange = async (id, qty) => {
    if (qty < 1) return;
    try {
      await updateCartItem(id, qty);
      fetchCartData();
    } catch (err) {
      console.error('Error updating quantity:', err);
    }
  };

  const handleCheckout = async () => {
    try {
      await placeOrder({ items: cart });
      alert('Order placed successfully!');
      fetchCartData();
    } catch (err) {
      console.error('Checkout failed:', err);
      alert('Checkout failed, try again.');
    }
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="cart-section">
      <h2>Your Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul className="cart-list">
            {cart.map((item) => (
              <li key={item.id} className="flex justify-between items-center mb-2">
                <span>
                  {item.name} x{' '}
                  <input
                    type="number"
                    value={item.quantity}
                    min="1"
                    onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                    className="w-16 border rounded px-1"
                  />{' '}
                  - ${item.price * item.quantity}
                </span>
                <button
                  onClick={() => handleRemove(item.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <p className="font-bold mt-4">Total: ${total}</p>
          <div className="mt-4 flex gap-2">
            <button
              onClick={handleCheckout}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
            >
              Checkout
            </button>
            <button
              onClick={() => clearCart().then(fetchCartData)}
              className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition"
            >
              Clear Cart
            </button>
          </div>
        </>
      )}
    </div>
  );
}
