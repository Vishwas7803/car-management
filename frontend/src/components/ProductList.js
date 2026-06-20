import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productService } from '../services/api';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await productService.getProducts();
      setProducts(response.data);
    } catch (err) {
      setError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchKeyword.trim()) {
      fetchProducts();
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await productService.searchProducts(searchKeyword);
      setProducts(response.data);
    } catch (err) {
      setError('Failed to search products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productService.deleteProduct(id);
        setProducts(products.filter(p => p._id !== id));
      } catch (err) {
        setError('Failed to delete product');
      }
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <button 
          className="btn btn-success"
          onClick={() => navigate('/create')}
          style={{ marginBottom: '1rem' }}
        >
          + Add New Car
        </button>

        <form onSubmit={handleSearch} className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search cars by title, description, or tags..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">
            Search
          </button>
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={() => {
              setSearchKeyword('');
              fetchProducts();
            }}
          >
            Clear
          </button>
        </form>
      </div>

      {error && <div className="error">{error}</div>}

      {loading ? (
        <div className="loading">Loading products...</div>
      ) : products.length === 0 ? (
        <div style={{ textAlign: 'center', color: 'white', padding: '2rem' }}>
          <p>No products found. Create your first car!</p>
        </div>
      ) : (
        <div className="products-container">
          {products.map((product) => (
            <div key={product._id} className="product-card">
              {product.images && product.images.length > 0 && (
                <img 
                  src={product.images[0].startsWith('data:') 
                    ? product.images[0] 
                    : `data:image/jpeg;base64,${product.images[0]}`}
                  alt={product.title}
                  className="product-image"
                />
              )}
              <div className="product-content">
                <h3 className="product-title">{product.title}</h3>
                <p className="product-description">
                  {product.description.substring(0, 100)}...
                </p>
                <div className="product-tags">
                  {product.tags.map((tag, idx) => (
                    <span key={idx} className="tag">{tag}</span>
                  ))}
                </div>
                <div className="product-actions">
                  <button 
                    className="btn btn-primary"
                    onClick={() => navigate(`/product/${product._id}`)}
                  >
                    View
                  </button>
                  <button 
                    className="btn btn-danger"
                    onClick={() => handleDelete(product._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductList;
