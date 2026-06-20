const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/car-management', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));

// API Documentation Route
app.get('/api/docs', (req, res) => {
  res.json({
    message: 'Car Management API Documentation',
    baseUrl: '/api',
    endpoints: [
      {
        method: 'POST',
        path: '/auth/signup',
        description: 'Create a new user',
        body: { email: 'user@example.com', password: 'password123', name: 'John Doe' },
        response: { token: 'jwt_token', user: { id, email, name } }
      },
      {
        method: 'POST',
        path: '/auth/login',
        description: 'Login user',
        body: { email: 'user@example.com', password: 'password123' },
        response: { token: 'jwt_token', user: { id, email, name } }
      },
      {
        method: 'POST',
        path: '/products',
        description: 'Create a new product (car)',
        headers: { Authorization: 'Bearer token' },
        body: { title: 'Car Title', description: 'Description', tags: ['tag1'], images: ['base64_images'] },
        response: { product: { id, title, description, tags, images, userId, createdAt } }
      },
      {
        method: 'GET',
        path: '/products',
        description: 'Get all products for logged-in user',
        headers: { Authorization: 'Bearer token' },
        response: [{ id, title, description, tags, images, userId, createdAt }]
      },
      {
        method: 'GET',
        path: '/products/search?keyword=value',
        description: 'Search products by keyword',
        headers: { Authorization: 'Bearer token' },
        response: [{ id, title, description, tags, images, userId, createdAt }]
      },
      {
        method: 'GET',
        path: '/products/:id',
        description: 'Get particular product details',
        headers: { Authorization: 'Bearer token' },
        response: { id, title, description, tags, images, userId, createdAt }
      },
      {
        method: 'PUT',
        path: '/products/:id',
        description: 'Update a product',
        headers: { Authorization: 'Bearer token' },
        body: { title: 'Updated Title', description: 'Updated', tags: ['tag1'], images: ['base64_images'] },
        response: { id, title, description, tags, images, userId, updatedAt }
      },
      {
        method: 'DELETE',
        path: '/products/:id',
        description: 'Delete a product',
        headers: { Authorization: 'Bearer token' },
        response: { message: 'Product deleted successfully' }
      }
    ]
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API Documentation available at http://localhost:${PORT}/api/docs`);
});
