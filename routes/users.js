const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Product = require('../models/Product');
const Purchase = require('../models/Purchase');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get current user profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    // Get user statistics
    const totalListings = await Product.countDocuments({ seller: req.user._id });
    const activeListings = await Product.countDocuments({ 
      seller: req.user._id, 
      isAvailable: true 
    });
    const totalPurchases = await Purchase.countDocuments({ buyer: req.user._id });
    const totalSales = await Purchase.countDocuments({ 
      'items.seller': req.user._id 
    });

    res.json({
      user,
      stats: {
        totalListings,
        activeListings,
        totalPurchases,
        totalSales
      }
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', [
  auth,
  body('email').optional().isEmail().withMessage('Please include a valid email'),
  body('username').optional().isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
  body('firstName').optional().notEmpty().withMessage('First name cannot be empty'),
  body('lastName').optional().notEmpty().withMessage('Last name cannot be empty')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      username,
      email,
      firstName,
      lastName,
      phone,
      address,
      profileImage
    } = req.body;

    // Check if username or email already exists (excluding current user)
    if (username || email) {
      const existingUser = await User.findOne({
        $and: [
          { _id: { $ne: req.user._id } },
          { $or: [
            username ? { username } : {},
            email ? { email } : {}
          ]}
        ]
      });

      if (existingUser) {
        return res.status(400).json({ 
          message: 'Username or email already exists' 
        });
      }
    }

    const updateFields = {};
    if (username) updateFields.username = username;
    if (email) updateFields.email = email;
    if (firstName) updateFields.firstName = firstName;
    if (lastName) updateFields.lastName = lastName;
    if (phone !== undefined) updateFields.phone = phone;
    if (address) updateFields.address = address;
    if (profileImage !== undefined) updateFields.profileImage = profileImage;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateFields },
      { new: true }
    );

    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/:id
// @desc    Get user by ID (public profile)
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -email -phone -address');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user's active listings
    const listings = await Product.find({ 
      seller: req.params.id, 
      isAvailable: true 
    })
    .sort({ createdAt: -1 })
    .limit(6);

    // Get user statistics
    const totalListings = await Product.countDocuments({ 
      seller: req.params.id,
      isAvailable: true 
    });
    const totalSales = await Purchase.countDocuments({ 
      'items.seller': req.params.id 
    });

    res.json({
      user,
      listings,
      stats: {
        totalListings,
        totalSales,
        memberSince: user.joinedDate
      }
    });
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/me/listings
// @desc    Get current user's listings
// @access  Private
router.get('/me/listings', auth, async (req, res) => {
  try {
    const { status = 'all', page = 1, limit = 10 } = req.query;

    let query = { seller: req.user._id };
    
    if (status !== 'all') {
      query.isAvailable = status === 'active';
    }

    const listings = await Product.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Product.countDocuments(query);

    res.json({
      listings,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/me/purchases
// @desc    Get current user's purchase history
// @access  Private
router.get('/me/purchases', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const purchases = await Purchase.find({ buyer: req.user._id })
      .populate('items.product', 'title images price')
      .populate('items.seller', 'username firstName lastName')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Purchase.countDocuments({ buyer: req.user._id });

    res.json({
      purchases,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
