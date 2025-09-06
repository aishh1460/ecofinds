const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Electronics',
      'Clothing',
      'Home & Garden',
      'Books',
      'Sports & Outdoors',
      'Toys & Games',
      'Automotive',
      'Health & Beauty',
      'Jewelry & Accessories',
      'Art & Collectibles',
      'Other'
    ]
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  condition: {
    type: String,
    required: true,
    enum: ['Like New', 'Good', 'Fair', 'Poor']
  },
  images: [{
    url: String,
    publicId: String
  }],
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  views: {
    type: Number,
    default: 0
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  location: {
    city: String,
    state: String,
    country: String
  },
  tags: [String],
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for search functionality
productSchema.index({ 
  title: 'text', 
  description: 'text', 
  category: 'text',
  tags: 'text'
});

// Index for filtering and sorting
productSchema.index({ category: 1, price: 1, createdAt: -1 });
productSchema.index({ seller: 1, createdAt: -1 });
productSchema.index({ isAvailable: 1, featured: -1, createdAt: -1 });

module.exports = mongoose.model('Product', productSchema);
