import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  signup: (name, email, password) =>
    api.post('/auth/signup', { name, email, password }),
  login: (email, password) =>
    api.post('/auth/login', { email, password }),
};

export const productService = {
  createProduct: (title, description, tags, images) =>
    api.post('/products', { title, description, tags, images }),
  getProducts: () =>
    api.get('/products'),
  searchProducts: (keyword) =>
    api.get(`/products/search?keyword=${keyword}`),
  getProduct: (id) =>
    api.get(`/products/${id}`),
  updateProduct: (id, title, description, tags, images) =>
    api.put(`/products/${id}`, { title, description, tags, images }),
  deleteProduct: (id) =>
    api.delete(`/products/${id}`),
};

export default api;
