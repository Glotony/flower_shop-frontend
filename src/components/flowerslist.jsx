// src/components/FlowerList.jsx
import { useEffect, useState } from "react";
import { getFlowers, addToCart } from "../api";

export default function FlowerList({ onAddToCart }) {
  const [flowers, setFlowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // fetch flowers from backend
  useEffect(() => {
    const fetchFlowers = async () => {
      try {
        const data = await getProducts();
        setFlowers(data);
      } catch (err) {
        console.error("Failed to load flowers:", err);
        setError("Failed to load flowers. Try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchFlowers();
  }, []);

  // add flower to cart
  const handleAddToCart = async (id) => {
    try {
      await addToCart(id);
      alert("Added to cart!");
      if (onAddToCart) onAddToCart(); // update cart count in header
    } catch (err) {
      console.error("Add to cart failed:", err);
      alert("Could not add item to cart.");
    }
  };

  if (loading)
    return <p className="text-center text-gray-500 mt-10">Loading flowers...</p>;
  if (error)
    return <p className="text-center text-red-500 mt-10">{error}</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {flowers.map((flower) => (
        <div
          key={flower.id}
          className="border rounded-2xl p-3 shadow-md hover:shadow-xl transition bg-white"
        >
          <img
            src={flower.image_url || "/placeholder.jpg"}
            alt={flower.name}
            className="w-full h-48 object-cover rounded-xl"
          />
          <h3 className="text-xl font-bold mt-3">{flower.name}</h3>
          <p className="text-gray-600 line-clamp-2">{flower.description}</p>
          <p className="text-green-600 font-semibold mt-2">€{flower.price}</p>
          <button
            onClick={() => handleAddToCart(flower.id)}
            className="bg-green-500 text-white px-4 py-2 rounded-xl mt-3 hover:bg-green-600 transition"
          >
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  );
}
