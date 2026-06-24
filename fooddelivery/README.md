# 🍛 FeastNow — Full Stack Food Delivery App

> **Stack:** Node.js · Express.js · MongoDB · Vanilla HTML/CSS/JS

---

## 📁 Project Structure

```
fooddelivery/
├── backend/
│   ├── models/
│   │   ├── User.js        ← User schema (bcrypt password hashing)
│   │   ├── Food.js        ← Food item schema
│   │   └── Order.js       ← Order schema
│   ├── routes/
│   │   ├── authRoutes.js  ← Register, Login, Profile
│   │   ├── foodRoutes.js  ← CRUD + seed data
│   │   ├── orderRoutes.js ← Place, view, cancel orders
│   │   └── cartRoutes.js  ← Add/remove/update cart
│   ├── middleware/
│   │   └── authMiddleware.js ← JWT protect + adminOnly
│   ├── server.js          ← Express app entry point
│   ├── package.json
│   └── .env.example
└── frontend/
    └── index.html         ← Single-page UI (no framework needed)
```

---

## 🚀 Setup & Run

### 1. Prerequisites
- Node.js v18+
- MongoDB running locally (`mongod`) or MongoDB Atlas URI

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env        # Edit with your MongoDB URI & JWT secret
npm run dev                 # Starts on http://localhost:5000
```

### 3. Seed Sample Food Data (first time)
Register a user, then make them admin in MongoDB Compass:
```
db.users.updateOne({ email: "you@email.com" }, { $set: { role: "admin" } })
```
Then call the seed endpoint (from Postman or curl):
```
POST http://localhost:5000/api/foods/seed/data
Authorization: Bearer <your_token>
```

### 4. Frontend
Open `frontend/index.html` directly in your browser.
> The API base URL is `http://localhost:5000/api` — update it in the JS if needed.

---

## 🔌 API Endpoints

| Method | Route                         | Access  | Description              |
|--------|-------------------------------|---------|--------------------------|
| POST   | /api/auth/register            | Public  | Register new user        |
| POST   | /api/auth/login               | Public  | Login, get JWT token     |
| GET    | /api/auth/profile             | User    | Get logged-in profile    |
| PUT    | /api/auth/profile             | User    | Update profile           |
| GET    | /api/foods                    | Public  | List all foods           |
| GET    | /api/foods?category=Pizza     | Public  | Filter by category       |
| GET    | /api/foods?search=burger      | Public  | Search by name           |
| GET    | /api/foods/:id                | Public  | Single food item         |
| POST   | /api/foods                    | Admin   | Add new food             |
| PUT    | /api/foods/:id                | Admin   | Update food              |
| DELETE | /api/foods/:id                | Admin   | Delete food              |
| POST   | /api/foods/seed/data          | Admin   | Seed 8 sample items      |
| POST   | /api/orders                   | User    | Place an order           |
| GET    | /api/orders/myorders          | User    | Get my orders            |
| GET    | /api/orders                   | Admin   | All orders               |
| PUT    | /api/orders/:id/status        | Admin   | Update order status      |
| PUT    | /api/orders/:id/cancel        | User    | Cancel order             |
| GET    | /api/cart                     | User    | View cart                |
| POST   | /api/cart/add                 | User    | Add item to cart         |
| PUT    | /api/cart/update/:foodId      | User    | Update item quantity     |
| DELETE | /api/cart/remove/:foodId      | User    | Remove item from cart    |
| DELETE | /api/cart/clear               | User    | Clear entire cart        |

---

## ✨ Features

- **User Auth** — Register, Login, JWT-protected routes, bcrypt password hashing
- **Menu** — Browse by category, search by name, food cards with ratings & prep time
- **Cart** — Add/remove/update quantities, stored in localStorage (frontend) or MongoDB (backend cart API)
- **Orders** — Place orders, view history with status badges, cancel active orders
- **Admin** — Seed food data, manage menu, update order statuses
- **Responsive UI** — Works on mobile and desktop

---

## 🛠️ What You Can Add Next (for resume!)

- [ ] Razorpay / Stripe payment integration
- [ ] Real-time order tracking with Socket.io
- [ ] Admin dashboard (revenue charts, order stats)
- [ ] React.js frontend to replace vanilla HTML
- [ ] Image uploads with Multer + Cloudinary
- [ ] Email notifications with Nodemailer
- [ ] Deploy backend on Render, frontend on Vercel

---

## 💡 Concepts You'll Learn from This Project

- REST API design with Express.js
- MongoDB schemas and Mongoose ODM
- JWT authentication & middleware
- Password hashing with bcryptjs
- Frontend-backend communication with fetch API
- CORS handling
- MVC-style project structure
