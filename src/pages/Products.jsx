import { useEffect, useState } from 'react';
import { getFlowers, addToCart as addToCartAPI } from '../api.js';
import { useCart } from '../context/CartContext';
import styles from '../css/products.module.css'; // plant-themed CSS module

export default function Products() {
  const [flowers, setFlowers] = useState([]);
  const [loadingIds, setLoadingIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { cart, setCart } = useCart();

  const fetchFlowers = async () => {
    setLoading(true);
    try {
      const data = await getFlowers();
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

  const handleAddToCart = async (flower) => {
    if (loadingIds.includes(flower.id)) return;
    setLoadingIds((prev) => [...prev, flower.id]);

    try {
      const existing = cart.find((item) => item.flowerId === flower.id);
      if (existing) {
        setCart(
          cart.map((item) =>
            item.flowerId === flower.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        );
      } else {
        setCart([...cart, { flowerId: flower.id, name: flower.name, price: flower.price, quantity: 1 }]);
      }

      await addToCartAPI(flower.id, 1);
    } catch (err) {
      console.error('Error adding to cart:', err);
      alert('Failed to add to cart.');
    } finally {
      setLoadingIds((prev) => prev.filter((id) => id !== flower.id));
    }
  };

  if (loading) return <p className="text-center mt-10">Loading products...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className={styles.container}>
      <div className={styles['content-wrapper']}>
        <h2 className={styles.title}>Our Flowers & Plants</h2>
        <div className={styles.grid}>
          {flowers.map((flower) => (
            <div key={flower.id} className={styles.card}>
              <img
                src={flower.image_url || `https://picsum.photos/seed/${flower.id}/300/200`}
                alt={flower.name}
                className={styles.image}
              />
              <h3 className={styles.name}>{flower.name}</h3>
              <p className={styles.price}>€{flower.price.toFixed(2)}</p>
              <button
                onClick={() => handleAddToCart(flower)}
                disabled={loadingIds.includes(flower.id)}
                className={styles.button}
              >
                {loadingIds.includes(flower.id) ? 'Adding...' : 'Add to Cart'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
