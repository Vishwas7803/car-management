import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { productService } from '../services/api';

function ProductForm({ existingProduct = null }) {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    title: existingProduct?.title || '',
    description: existingProduct?.description || '',
    tags: existingProduct?.tags || [],
    images: existingProduct?.images || [],
  });

  const [currentTag, setCurrentTag] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    if (currentTag.trim()) {
      setFormData({
        ...formData,
        tags: [...formData.tags, currentTag.trim()],
      });
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (index) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((_, i) => i !== index),
    });
  };

  const handleImageUpload = (e) => {
    const files = e.target.files;
    if (files) {
      if (formData.images.length + files.length > 10) {
        setError('Maximum 10 images allowed');
        return;
      }

      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          setFormData((prev) => ({
            ...prev,
            images: [...prev.images, event.target.result],
          }));
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim() || !formData.description.trim()) {
      setError('Title and description are required');
      return;
    }

    setLoading(true);
    try {
      if (existingProduct) {
        await productService.updateProduct(
          existingProduct._id,
          formData.title,
          formData.description,
          formData.tags,
          formData.images
        );
      } else {
        await productService.createProduct(
          formData.title,
          formData.description,
          formData.tags,
          formData.images
        );
      }
      navigate('/products');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>{existingProduct ? 'Edit Car' : 'Add New Car'}</h2>

      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter car title (e.g., 2020 Toyota Camry)"
            required
          />
        </div>

        <div className="form-group">
          <label>Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter detailed description"
            required
          />
        </div>

        <div className="form-group">
          <label>Add Tags</label>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            <input
              type="text"
              value={currentTag}
              onChange={(e) => setCurrentTag(e.target.value)}
              placeholder="Type a tag (e.g., sedan, automatic)"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAddTag(e);
                }
              }}
            />
            <button 
              type="button" 
              className="btn btn-primary"
              onClick={handleAddTag}
            >
              Add Tag
            </button>
          </div>

          {formData.tags.length > 0 && (
            <div className="tags-input-container">
              {formData.tags.map((tag, index) => (
                <div key={index} className="tag-item">
                  {tag}
                  <button 
                    type="button"
                    onClick={() => handleRemoveTag(index)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="form-group">
          <label>Images (Max 10)</label>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            multiple
            accept="image/*"
            style={{ display: 'none' }}
          />
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => fileInputRef.current?.click()}
          >
            Choose Images
          </button>

          {formData.images.length > 0 && (
            <div>
              <p style={{ marginTop: '1rem', color: '#666' }}>
                {formData.images.length} image(s) selected
              </p>
              <div className="image-preview">
                {formData.images.map((image, index) => (
                  <div key={index} style={{ position: 'relative' }}>
                    <img
                      src={image.startsWith('data:') ? image : `data:image/jpeg;base64,${image}`}
                      alt={`Preview ${index}`}
                      className="preview-img"
                    />
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => handleRemoveImage(index)}
                      style={{
                        position: 'absolute',
                        top: '5px',
                        right: '5px',
                        padding: '5px 10px',
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
            style={{ flex: 1 }}
          >
            {loading ? 'Saving...' : (existingProduct ? 'Update Car' : 'Create Car')}
          </button>
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={() => navigate('/products')}
            style={{ flex: 1 }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProductForm;
