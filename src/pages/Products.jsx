// src/pages/Products.jsx
import { useEffect, useState } from 'react'
import { getFlowers, addToCart } from '../api'  // match your backend route

export default function Products({ onAddToCart }) {
  const [flowers, setFlowers] = useState([])
  const [cartIds, setCartIds] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchFlowers = async () => {
      try {
        const data = await getFlowers()
        setFlowers(data)
        if (onAddToCart) onAddToCart() // update nav cart count
      } catch (err) {
        console.error('Error fetching flowers:', err)
        setError('Failed to load flowers. Try again later.')
      } finally {
        setLoading(false)
      }
    }
    fetchFlowers()
  }, [onAddToCart])

  const handleAdd = async (id) => {
    try {
      await addToCart(id)
      setCartIds((prev) => [...prev, id])
      if (onAddToCart) onAddToCart() // refresh cart count
    } catch (err) {
      console.error('Error adding to cart:', err)
      alert('Could not add flower to cart.')
    }
  }

  if (loading) return <p className="text-center mt-10">Loading flowers...</p>
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Our Plants</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {flowers.map((f) => {
          const inCart = cartIds.includes(f.id)
          return (
            <div
              key={f.id}
              className="border rounded-2xl p-4 shadow-md hover:shadow-xl transition bg-white"
            >
              <img
                src={p.image_url || 'https://via.placeholder.com/150'}
                alt={p.name}
              />
              <h3 className="text-xl font-bold mt-3">{f.name}</h3>
              <p className="text-gray-600 line-clamp-2">{f.description}</p>
              <p className="text-green-600 font-semibold mt-2">€{f.price}</p>
              <button
                onClick={() => handleAdd(f.id)}
                disabled={inCart}
                className={`mt-3 px-4 py-2 rounded-xl text-white ${inCart ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'
                  } transition`}
              >
                {inCart ? 'In Cart' : 'Add to Cart'}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
