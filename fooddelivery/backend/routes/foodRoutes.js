const express = require('express');
const router  = express.Router();
const Food    = require('../models/Food');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// GET /api/foods          — list all (public), filter by category
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.search)
      filter.name = { $regex: req.query.search, $options: 'i' };

    const foods = await Food.find({ ...filter, isAvailable: true });
    res.json(foods);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/foods/:id      — single food (public)
router.get('/:id', async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) return res.status(404).json({ message: 'Food not found' });
    res.json(food);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/foods         — admin: add food
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const food = await Food.create(req.body);
    res.status(201).json(food);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/foods/:id      — admin: update food
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const food = await Food.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!food) return res.status(404).json({ message: 'Food not found' });
    res.json(food);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/foods/:id   — admin: delete food
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const food = await Food.findByIdAndDelete(req.params.id);
    if (!food) return res.status(404).json({ message: 'Food not found' });
    res.json({ message: 'Food deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/foods/seed    — seed sample data
// Allowed: admin always, OR any logged-in user if food DB is empty (first-time setup)
router.post('/seed/data', protect, async (req, res) => {
  const count = await Food.countDocuments();
  if (count > 0 && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required to re-seed existing data' });
  }
  try {
    await Food.deleteMany({});
    const sampleFoods = [
      {
        name: 'Chicken Biryani', category: 'Biryani', price: 299,
        description: 'Slow-cooked basmati rice layered with succulent chicken, caramelised onions, saffron, and whole spices. Served with cooling raita and a wedge of lemon.',
        image: '🍛', rating: 4.8, prepTime: 30,
      },
      {
        name: 'Paneer Butter Masala', category: 'Curry', price: 249,
        description: 'Velvety tomato-cashew gravy with soft paneer cubes, finished with butter and dried fenugreek leaves. Best paired with garlic naan or jeera rice.',
        image: '🧀', rating: 4.6, prepTime: 20,
      },
      {
        name: 'Chicken Burger', category: 'Burgers', price: 179,
        description: 'Crispy fried chicken thigh marinated in smoky spices, layered with sriracha mayo, crisp lettuce, and pickled jalapeños in a toasted brioche bun.',
        image: '🍔', rating: 4.5, prepTime: 15,
      },
      {
        name: 'Veg Cheese Pizza', category: 'Pizza', price: 299,
        description: 'Hand-stretched thin-crust loaded with bell peppers, corn, olives, mushrooms, and a generous stretch of mozzarella on a tangy tomato base.',
        image: '🍕', rating: 4.3, prepTime: 25,
      },
      {
        name: 'Masala Dosa', category: 'South Indian', price: 129,
        description: 'Golden-crisp fermented rice-lentil crepe filled with spiced potato masala. Served with coconut chutney and tangy sambar straight from the kadai.',
        image: '🫓', rating: 4.7, prepTime: 12,
      },
      {
        name: 'Hakka Noodles', category: 'Noodles', price: 149,
        description: 'Wok-tossed egg noodles with crunchy vegetables, shredded chicken, spring onions, and a bold sauce of soy, chilli, and sesame oil.',
        image: '🍜', rating: 4.2, prepTime: 18,
      },
      {
        name: 'Mango Lassi', category: 'Drinks', price: 89,
        description: 'Thick Alphonso mango pulp blended with chilled full-fat yoghurt, a hint of cardamom, and a drizzle of rose water. Perfectly sweet, perfectly cold.',
        image: '🥭', rating: 4.6, prepTime: 5,
      },
      {
        name: 'Chocolate Brownie Sundae', category: 'Desserts', price: 149,
        description: 'Warm fudgy dark-chocolate brownie topped with a scoop of vanilla bean ice-cream, hot chocolate sauce, and a sprinkle of crushed walnuts.',
        image: '🍫', rating: 4.8, prepTime: 8,
      },
      {
        name: 'Paneer Roll', category: 'Rolls', price: 139,
        description: 'Flaky whole-wheat paratha wrapped around tandoori paneer, sliced onions, green chutney, and a squeeze of lemon. Street-food classic, elevated.',
        image: '🌯', rating: 4.3, prepTime: 12,
      },
      {
        name: 'Veg Thali', category: 'Thali', price: 199,
        description: 'Complete wholesome meal: dal makhani, seasonal sabzi, aloo jeera, soft phulkas, steamed rice, papad, pickle, and a small bowl of kheer.',
        image: '🥘', rating: 4.5, prepTime: 25,
      },
      {
        name: 'Chicken 65', category: 'Starters', price: 219,
        description: 'Deep-fried chicken bites marinated in yoghurt, ginger-garlic, red chilli, and curry leaves. Crispy outside, juicy inside — served with mint chutney.',
        image: '🍗', rating: 4.7, prepTime: 20,
      },
      {
        name: 'Cold Coffee', category: 'Drinks', price: 99,
        description: 'Strong decoction blended with chilled full-cream milk, sugar, and vanilla ice-cream, topped with cocoa powder. Thick, indulgent, refreshing.',
        image: '☕', rating: 4.4, prepTime: 5,
      },
    ];
    await Food.insertMany(sampleFoods);
    res.json({ message: `${sampleFoods.length} items seeded successfully` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
