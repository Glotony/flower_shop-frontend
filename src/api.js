// src/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: '/api', // <-- use proxy to backend
});

// Fetch all products
export const getProducts = async () => {
  const res = await API.get('/products'); // /api/products -> proxied
  return res.data;
};

// Add item to cart
export const addToCart = async (productId) => {
  const res = await API.post('/cart', { productId });
  return res.data;
};

// Get cart items
export const getCart = async () => {
  const res = await API.get('/cart');
  return res.data;
};
