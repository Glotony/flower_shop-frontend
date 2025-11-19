import { useEffect, useState } from 'react';
import { getCart, updateCartItem, removeFromCart, clearCart, placeOrderCart } from '../api.js';
import ProtectedRoute from '../components/ProtectedRoute';
import styles from '../css/cart.module.css';

export default function Cart({ onUpdateCart }) {
  const [cart, setCart] = useState([]);
  const [loadingItems, setLoadingItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCartData = async () => {
    setLoading(true);
    try {
      const data = await getCart();
      setCart(data || []);
      if (onUpdateCart) onUpdateCart(); // update header/cart count
    } catch (err) {
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartData();
  }, []);

  const handleQuantityChange = async (flowerId, quantity) => {
    if (quantity < 1 || loadingItems.includes(flowerId)) return;
    setLoadingItems((prev) => [...prev, flowerId]);

    try {
      await updateCartItem(flowerId, quantity);
      await fetchCartData();
    } catch (err) {
      console.error('Error updating quantity:', err);
    } finally {
      setLoadingItems((prev) => prev.filter((id) => id !== flowerId));
    }
  };

  const handleRemove = async (flowerId) => {
    if (loadingItems.includes(flowerId)) return;
    setLoadingItems((prev) => [...prev, flowerId]);

    try {
      await removeFromCart(flowerId);
      await fetchCartData();
    } catch (err) {
      console.error('Error removing item:', err);
    } finally {
      setLoadingItems((prev) => prev.filter((id) => id !== flowerId));
    }
  };

  const handleCheckout = async () => {
    if (!cart.length) return alert('Cart is empty.');
    try {
      const orderItems = cart.map((item) => ({
        flowerId: item.flowerId,
        quantity: item.quantity,
      }));
      await placeOrderCart(orderItems); // ← use cart API
      alert('Order placed successfully!');
      await fetchCartData();
    } catch (err) {
      console.error('Checkout failed:', err);
      alert('Checkout failed, try again.');
    }
  };

  const handleClearCart = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await clearCart();
      await fetchCartData();
    } catch (err) {
      console.error('Error clearing cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const total = cart.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0);

  if (loading) return <p className="text-center mt-10">Loading your cart...</p>;

  return (
    <ProtectedRoute>
      <div className={`${styles['cart-section']} p-4`}>
        <h2 className="text-xl font-bold mb-4">Your Cart</h2>

        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            <ul className={`${styles['cart-list']} mb-4`}>
              {cart.map((item, idx) => (
                <li
                  key={`${item.flowerId}-${idx}`}
                  className="flex justify-between items-center mb-2"
                >
                  <span>
                    {item.name} x{' '}
                    <input
                      type="number"
                      value={item.quantity}
                      min="1"
                      disabled={loadingItems.includes(item.flowerId)}
                      onChange={(e) =>
                        handleQuantityChange(item.flowerId, parseInt(e.target.value))
                      }
                      className="w-16 border rounded px-1"
                    />{' '}
                    - €{((item.price || 0) * (item.quantity || 0)).toFixed(2)}
                  </span>

                  <button
                    onClick={() => handleRemove(item.flowerId)}
                    disabled={loadingItems.includes(item.flowerId)}
                    className={styles['remove-btn']}
                  >
                    {loadingItems.includes(item.flowerId) ? '...' : 'Remove'}
                  </button>
                </li>
              ))}
            </ul>

            <p className={styles['total']}>Total: €{total.toFixed(2)}</p>

            <div className="mt-4 flex gap-2">
              <button onClick={handleCheckout} className={styles['checkout-btn']}>
                Checkout
              </button>
              <button onClick={handleClearCart} className={styles['clear-btn']} disabled={loading}>
                Clear Cart
              </button>
            </div>
          </>
        )}
      </div>
    </ProtectedRoute>
  );
}
