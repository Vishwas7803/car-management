import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Auth from './components/Auth';
import ProductList from './components/ProductList';
import ProductForm from './components/ProductForm';
import ProductDetail from './components/ProductDetail';
import './styles/App.css';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/" />;
}

function EditProduct() {
  const { id } = window.location.pathname.split('/').pop();
  const [product, setProduct] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadProduct = async () => {
      try {
        // This will be loaded dynamically in ProductForm
        setLoading(false);
      } catch {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id]);

  return <ProductForm />;
}

function App() {
  const token = localStorage.getItem('token');

  return (
    <Router>
      <div className="App">
        {token && <Navbar />}
        <div className="container">
          <Routes>
            {/* Auth Routes */}
            <Route 
              path="/" 
              element={token ? <Navigate to="/products" /> : <Auth />}
            />

            {/* Protected Routes */}
            <Route 
              path="/products" 
              element={
                <ProtectedRoute>
                  <ProductList />
                </ProtectedRoute>
              }
            />

            <Route 
              path="/create" 
              element={
                <ProtectedRoute>
                  <ProductForm />
                </ProtectedRoute>
              }
            />

            <Route 
              path="/product/:id" 
              element={
                <ProtectedRoute>
                  <ProductDetail />
                </ProtectedRoute>
              }
            />

            <Route 
              path="/edit/:id" 
              element={
                <ProtectedRoute>
                  <EditProductPage />
                </ProtectedRoute>
              }
            />

            {/* 404 */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

// Component for editing products
function EditProductPage() {
  const { id } = window.location.pathname.match(/\/edit\/(.+)/) || [];
  const [product, setProduct] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadProduct = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(
          `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/products/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setProduct(data);
        }
      } catch (error) {
        console.error('Error loading product:', error);
      } finally {
        setLoading(false);
      }
    };
    if (id) loadProduct();
  }, [id]);

  if (loading) return <div className="loading">Loading...</div>;

  return <ProductForm existingProduct={product} />;
}

export default App;
