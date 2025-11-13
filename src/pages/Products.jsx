import { useEffect, useState } from 'react';
import { getProducts, addToCart, getCart } from '../api.js';

export default function Products({ onUpdateCart }) {
  const [flowers, setFlowers] = useState([]);
  const [loadingIds, setLoadingIds] = useState([]); // tracks adding status
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products from backend
  const fetchFlowers = async () => {
    setLoading(true);
    try {
      const data = await getProducts();
      setFlowers(data || []);
    } catch (err) {
      console.error('Error fetching flowers:', err);
      setError('Failed to load products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlowers();
  }, []);

  // Add product to cart
  const handleAddToCart = async (flowerId) => {
    if (loadingIds.includes(flowerId)) return;
    setLoadingIds((prev) => [...prev, flowerId]);

    try {
      await addToCart(flowerId, 1); // quantity = 1
      if (onUpdateCart) await onUpdateCart(); // update header/cart count
    } catch (err) {
      console.error('Error adding to cart:', err);
      alert('Failed to add to cart.');
    } finally {
      setLoadingIds((prev) => prev.filter((id) => id !== flowerId));
    }
  };

  if (loading) return <p className="text-center mt-10">Loading products...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Our Flowers</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {flowers.map((flower) => (
          <div
            key={flower.id}
            className="border rounded-2xl p-4 shadow-md hover:shadow-xl transition bg-white"
          >
            <img
              src={flower.image_url || `https://picsum.photos/seed/${flower.id}/300/200`}
              alt={flower.name}
              className="w-full h-48 object-cover rounded-xl"
            />
            <h3 className="text-xl font-bold mt-3">{flower.name}</h3>
            <p className="text-gray-600 line-clamp-2">{flower.description}</p>
            <p className="text-green-600 font-semibold mt-2">€{flower.price.toFixed(2)}</p>
            <button
              onClick={() => handleAddToCart(flower.id)}
              disabled={loadingIds.includes(flower.id)}
              className={`mt-3 px-4 py-2 rounded-xl text-white ${
                loadingIds.includes(flower.id)
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-500 hover:bg-green-600'
              } transition`}
            >
              {loadingIds.includes(flower.id) ? 'Adding...' : 'Add to Cart'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
