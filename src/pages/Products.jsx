// src/pages/Products.jsx
import { useEffect, useState } from 'react'
import { getProducts, addToCart } from '../api'

export default function Products({ onAddToCart }) {
  const [products, setProducts] = useState([])
  const [cartIds, setCartIds] = useState([])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts()
        setProducts(data)
        if (onAddToCart) onAddToCart() // optional: update nav cart count
      } catch (err) {
        console.error('Error fetching products:', err)
      }
    }
    fetchProducts()
  }, [onAddToCart])

  const handleAdd = async (id) => {
    try {
      await addToCart(id)
      setCartIds((prev) => [...prev, id])
      if (onAddToCart) onAddToCart() // refresh cart count
    } catch (err) {
      console.error('Error adding to cart:', err)
    }
  }

  return (
    <div className="products-section">
      <h2>Our Plants</h2>
      <div className="products-grid">
        {products.map((p) => {
          const inCart = cartIds.includes(p.id)
          return (
            <div key={p.id} className="product-card">
              <img
                src={p.image || 'https://via.placeholder.com/150'}
                alt={p.name}
              />
              <h3>{p.name}</h3>
              <p>${p.price}</p>
              <button onClick={() => handleAdd(p.id)} disabled={inCart}>
                {inCart ? 'In Cart' : 'Add to Cart'}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
