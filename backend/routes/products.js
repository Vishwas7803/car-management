const express = require('express');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

const router = express.Router();

// Create product
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, tags, images } = req.body;

    // Validation
    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    // Validate image count
    if (images && images.length > 10) {
      return res.status(400).json({ message: 'Maximum 10 images allowed' });
    }

    const product = new Product({
      title,
      description,
      tags: tags || [],
      images: images || [],
      userId: req.userId,
    });

    await product.save();

    res.status(201).json({
      message: 'Product created successfully',
      product,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all products for logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const products = await Product.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Search products
router.get('/search', auth, async (req, res) => {
  try {
    const { keyword } = req.query;

    if (!keyword) {
      return res.status(400).json({ message: 'Keyword is required' });
    }

    // Search in title, description, and tags
    const products = await Product.find({
      userId: req.userId,
      $or: [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
        { tags: { $regex: keyword, $options: 'i' } },
      ],
    });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get particular product
router.get('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if product belongs to the user
    if (product.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update product
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, description, tags, images } = req.body;

    // Validate image count
    if (images && images.length > 10) {
      return res.status(400).json({ message: 'Maximum 10 images allowed' });
    }

    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if product belongs to the user
    if (product.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Update fields
    if (title) product.title = title;
    if (description) product.description = description;
    if (tags) product.tags = tags;
    if (images) product.images = images;
    product.updatedAt = Date.now();

    await product.save();

    res.json({
      message: 'Product updated successfully',
      product,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete product
router.delete('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if product belongs to the user
    if (product.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Product.deleteOne({ _id: req.params.id });

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
