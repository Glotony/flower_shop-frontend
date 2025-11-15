// src/api.js
import axios from 'axios';

// -----------------------------------------
// ⚙️ BASE SETUP
// -----------------------------------------
const API = axios.create({
  baseURL: 'http://localhost:5000/api', // backend base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: attach token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// -----------------------------------------
// 🌸 FLOWERS
// -----------------------------------------
export const getFlowers = async () => (await API.get('/flowers')).data;
export const getProducts = async () => (await API.get('/flowers')).data;
export const getProductById = async (id) => (await API.get(`/flowers/${id}`)).data;
export const addProduct = async (data) => (await API.post('/flowers', data)).data;
export const updateProduct = async (id, data) => (await API.put(`/flowers/${id}`, data)).data;
export const deleteProduct = async (id) => (await API.delete(`/flowers/${id}`)).data;

// -----------------------------------------
// 🛒 CART
// -----------------------------------------
export const getCart = async () => (await API.get('/cart')).data;

// Add item to cart
export const addToCart = async (flowerId, quantity = 1) =>
  (await API.post('/cart', { flowerId, quantity })).data;

// Update single cart item
export const updateCartItem = async (flowerId, quantity) =>
  (await API.put(`/cart/${flowerId}`, { quantity })).data;

// Remove single item from cart
export const removeFromCart = async (flowerId) =>
  (await API.delete(`/cart/${flowerId}`)).data;

// Clear entire cart
export const clearCart = async () => (await API.delete('/cart')).data;
// place near your other exports in src/api.js
// Send entire cart to backend (backend should accept { items: [...] } on POST /api/cart)
export const placeOrderCart = async (items) =>
  (await API.post('/cart', { items })).data;


// -----------------------------------------
// 🌼 ORDERS
// -----------------------------------------
export const getOrders = async () => (await API.get('/orders')).data;
export const getOrderById = async (id) => (await API.get(`/orders/${id}`)).data;
export const placeOrder = async () => 
  (await API.post('/orders')).data; // hits /api/orders
export const cancelOrder = async (id) => (await API.delete(`/orders/${id}`)).data;
export const updateOrderStatus = async (id, status) =>
  (await API.put(`/orders/${id}`, { status })).data;

// -----------------------------------------
// 🌿 CUSTOMERS
// -----------------------------------------
export const registerCustomer = async (data) => (await API.post('/customers', data)).data;
export const getCustomerById = async (id) => (await API.get(`/customers/${id}`)).data;
export const updateCustomer = async (id, data) => (await API.put(`/customers/${id}`, data)).data;
export const deleteCustomer = async (id) => (await API.delete(`/customers/${id}`)).data;

// -----------------------------------------
// 🌸 REVIEWS
// -----------------------------------------
export const addReview = async (flowerId, review) =>
  (await API.post(`/flowers/${flowerId}/reviews`, review)).data;
export const getReviewsByFlowerId = async (flowerId) =>
  (await API.get(`/flowers/${flowerId}/reviews`)).data;
export const updateReview = async (reviewId, review) =>
  (await API.put(`/reviews/${reviewId}`, review)).data;
export const deleteReview = async (reviewId) =>
  (await API.delete(`/reviews/${reviewId}`)).data;

// -----------------------------------------
// 🌟 EXPORT API
// -----------------------------------------
export default API;
