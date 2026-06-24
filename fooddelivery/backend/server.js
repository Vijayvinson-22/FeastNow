const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ── Middleware ──────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Routes ──────────────────────────────────────────────────
app.use('/api/auth',      require('./routes/authRoutes'));
app.use('/api/foods',     require('./routes/foodRoutes'));
app.use('/api/orders',    require('./routes/orderRoutes'));
app.use('/api/cart',      require('./routes/cartRoutes'));

// ── Health check ────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ message: '🍛 FeastNow API is running!' });
});

// ── MongoDB Connection ───────────────────────────────────────
const PORT     = process.env.PORT     || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/fooddelivery';

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });
