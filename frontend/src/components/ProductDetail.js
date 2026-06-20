import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productService } from '../services/api';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await productService.getProduct(id);
      setProduct(response.data);
    } catch (err) {
      setError('Failed to fetch product');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productService.deleteProduct(id);
        navigate('/products');
      } catch (err) {
        setError('Failed to delete product');
      }
    }
  };

  const handleNextImage = () => {
    if (product.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
    }
  };

  const handlePrevImage = () => {
    if (product.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
    }
  };

  if (loading) {
    return <div className="loading">Loading product...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!product) {
    return <div className="error">Product not found</div>;
  }

  return (
    <div className="product-detail">
      {product.images && product.images.length > 0 && (
        <div style={{ position: 'relative', marginBottom: '2rem' }}>
          <img
            src={product.images[currentImageIndex].startsWith('data:')
              ? product.images[currentImageIndex]
              : `data:image/jpeg;base64,${product.images[currentImageIndex]}`}
            alt={product.title}
            className="product-detail-image"
          />
          {product.images.length > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
              <button 
                className="btn btn-secondary"
                onClick={handlePrevImage}
              >
                ← Previous
              </button>
              <span style={{ padding: '0.75rem 1.5rem', color: '#333' }}>
                {currentImageIndex + 1} / {product.images.length}
              </span>
              <button 
                className="btn btn-secondary"
                onClick={handleNextImage}
              >
                Next →
              </button>
            </div>
          )}
        </div>
      )}

      <h1 style={{ marginBottom: '1rem' }}>{product.title}</h1>

      <p style={{ fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
        {product.description}
      </p>

      {product.tags && product.tags.length > 0 && (
        <div>
          <h3 style={{ marginBottom: '0.5rem' }}>Tags:</h3>
          <div className="product-tags">
            {product.tags.map((tag, idx) => (
              <span key={idx} className="tag">{tag}</span>
            ))}
          </div>
        </div>
      )}

      <p style={{ color: '#999', marginTop: '2rem', fontSize: '0.9rem' }}>
        Created: {new Date(product.createdAt).toLocaleDateString()}
        {product.updatedAt && (
          <> | Updated: {new Date(product.updatedAt).toLocaleDateString()}</>
        )}
      </p>

      <div className="detail-actions">
        <button 
          className="btn btn-primary"
          onClick={() => navigate(`/edit/${product._id}`)}
        >
          Edit
        </button>
        <button 
          className="btn btn-danger"
          onClick={handleDelete}
        >
          Delete
        </button>
        <button 
          className="btn btn-secondary"
          onClick={() => navigate('/products')}
        >
          Back to List
        </button>
      </div>
    </div>
  );
}

export default ProductDetail;
