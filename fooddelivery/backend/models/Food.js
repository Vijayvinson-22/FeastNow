const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price:       { type: Number, required: true, min: 0 },
    category:    {
      type: String,
      required: true,
      enum: ['Biryani', 'Curry', 'Burgers', 'Pizza', 'South Indian', 'Noodles', 'Rolls', 'Starters', 'Thali', 'Drinks', 'Desserts', 'Salads'],
    },
    image:       { type: String, default: '' },    // URL or emoji
    isAvailable: { type: Boolean, default: true },
    rating:      { type: Number, default: 4.0, min: 0, max: 5 },
    prepTime:    { type: Number, default: 20 },   // minutes
  },
  { timestamps: true }
);

module.exports = mongoose.model('Food', foodSchema);
