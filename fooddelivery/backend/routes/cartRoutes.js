const express = require('express');
const router  = express.Router();
const mongoose = require('mongoose');

// Simple in-DB cart using a Cart model
const cartSchema = new mongoose.Schema({
  user:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true },
  items: [
    {
      food:     { type: mongoose.Schema.Types.ObjectId, ref: 'Food' },
      name:     String,
      price:    Number,
      image:    String,
      quantity: { type: Number, default: 1 },
    },
  ],
});
const Cart = mongoose.models.Cart || mongoose.model('Cart', cartSchema);

const { protect } = require('../middleware/authMiddleware');

// GET /api/cart
router.get('/', protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.food', 'name price image isAvailable');
    res.json(cart || { items: [] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/cart/add
router.post('/add', protect, async (req, res) => {
  try {
    const { foodId, name, price, image } = req.body;
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    const existing = cart.items.find((i) => i.food.toString() === foodId);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.items.push({ food: foodId, name, price, image, quantity: 1 });
    }

    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/cart/update/:foodId
router.put('/update/:foodId', protect, async (req, res) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const item = cart.items.find((i) => i.food.toString() === req.params.foodId);
    if (!item) return res.status(404).json({ message: 'Item not in cart' });

    if (quantity <= 0) {
      cart.items = cart.items.filter((i) => i.food.toString() !== req.params.foodId);
    } else {
      item.quantity = quantity;
    }

    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/cart/remove/:foodId
router.delete('/remove/:foodId', protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    cart.items = cart.items.filter((i) => i.food.toString() !== req.params.foodId);
    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/cart/clear
router.delete('/clear', protect, async (req, res) => {
  try {
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
    res.json({ message: 'Cart cleared' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
