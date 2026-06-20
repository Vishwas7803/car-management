const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  tags: [{
    type: String,
    required: true,
  }],
  images: [{
    type: String, // base64 or file path
  }],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Text index for search
ProductSchema.index({
  title: 'text',
  description: 'text',
  tags: 'text',
});

module.exports = mongoose.model('Product', ProductSchema);
