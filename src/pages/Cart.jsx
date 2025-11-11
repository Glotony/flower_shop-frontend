// src/pages/Cart.jsx
import { useEffect, useState } from 'react'
import { getCart } from '../api'

export default function Cart({ onUpdateCart }) {
  const [cart, setCart] = useState([])

  const fetchCartData = async () => {
    try {
      const data = await getCart()
      setCart(data)
      if (onUpdateCart) onUpdateCart() // update header cart count
    } catch (err) {
      console.error('Error fetching cart:', err)
    }
  }

  useEffect(() => {
    fetchCartData()
  }, [onUpdateCart])

  const handleRemove = async (id) => {
    try {
      await fetch(`/api/cart/${id}`, { method: 'DELETE' })
      fetchCartData()
    } catch (err) {
      console.error('Error removing from cart:', err)
    }
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <div className="cart-section">
      <h2>Your Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul className="cart-list">
            {cart.map((item) => (
              <li key={item.id}>
                {item.name} x {item.quantity} - ${item.price * item.quantity}
                <button onClick={() => handleRemove(item.id)}>Remove</button>
              </li>
            ))}
          </ul>
          <p>Total: ${total}</p>
        </>
      )}
    </div>
  )
}
