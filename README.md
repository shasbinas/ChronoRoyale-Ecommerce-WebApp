# ⌚ ChronoRoyale - Full Stack E-commerce WebApp

ChronoRoyale is a modern full-stack e-commerce platform designed for luxury watch sales. It provides a seamless shopping experience with secure authentication, cart and wishlist system, order management, and a powerful admin dashboard for analytics and inventory control.

---

## 📋 Table of Contents

- [Introduction](#introduction)
- [⚙ Tech Stack](#-tech-stack)
- [🔋 Features](#-features)
- [🌐 Deployment](#-deployment)
- [📸 Preview](#-preview)
- [📦 Quick Start](#-quick-start)
- [📡 API Documentation](#-api-documentation)
- [🧑‍💻 Author](#-author)
- [⭐ Contribute](#-contribute)
- [📜 License](#-license)

---

## Introduction

ChronoRoyale is built to deliver a modern e-commerce experience specifically for luxury watches. Users can browse, wishlist, add to cart, and place orders. Admins can manage products, users, and orders with ease.

---

## ⚙ Tech Stack

| Layer     | Technologies Used |
|-----------|------------------|
| Frontend  | HTML, CSS, JavaScript, Handlebars |
| Backend   | Node.js, Express.js |
| Database  | MongoDB |
| Auth      | JWT / Sessions |
| Payment   | Razorpay |
| Deployment| Render / AWS / DigitalOcean / Heroku |

---

## 🔋 Features

### 🛒 User Side
- User Authentication (Login / Signup)
- Browse Watches with Filters & Search
- Product Details Page with Image Gallery
- Add to Cart / Wishlist
- Checkout with Address & Payment Integration
- Order Tracking & History
- Profile Management

### 🛠️ Admin Dashboard
- Manage Products (Add / Edit / Delete)
- Order Management
- User Management
- Real-Time Analytics & Reports

---

## 🌐 Deployment

> You can deploy the app on platforms like Render, AWS, DigitalOcean, or Heroku. Make sure your environment variables are set correctly for production.

---

## 📸 Preview

> *(Add images here when available — e.g., `/public/screenshots/` folder)*

| Home Page | Product Page | Cart | Admin Dashboard |
|-----------|--------------|------|----------------|
| `Image` | `Image` | `Image` | `Image` |

---

## 📦 Quick Start (Setup Guide)

### 1️⃣ Clone the repository

```bash
git clone https://github.com/shasbinas/ChronoRoyale-Ecommerce-WebApp.git
cd ChronoRoyale-Ecommerce-WebApp
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Create `.env` file

```env
PORT=9002
DATABASE=ChronoRoyale
MONGO_DB_URI="your_mongodb_connection_string"
JWT_SECRET=your_secret_key
ADMIN_EMAIL=admin
ADMIN_PASSWORD=123
RAZORPAY_KEY=your_key      # optional
RAZORPAY_SECRET=your_secret # optional
```

### 4️⃣ Start the server

```bash
npm run dev   # Development mode
npm start     # Production mode
```

Visit → **http://localhost:9002**

---

## 📡 API Documentation

### 🔐 Authentication

| Method | Endpoint        | Description         | Body / Params |
|--------|----------------|--------------------|---------------|
| POST   | `/auth/register` | Register a new user | `{ name, email, password }` |
| POST   | `/auth/login`    | Login user & return token/session | `{ email, password }` |
| GET    | `/auth/logout`   | Logout user | - |
| GET    | `/auth/profile` *(Protected)* | Get logged-in user details | Header: `Authorization: Bearer <token>` |

---

### ⌚ Products

| Method | Endpoint        | Description         | Body / Params |
|--------|----------------|--------------------|---------------|
| GET    | `/products`        | Get all products | Optional: `?search=&category=&sort=` |
| GET    | `/products/:id`    | Get single product details | Path: `id` |
| POST   | `/admin/add-product` *(Admin)* | Create new product | `{ name, brand, price, description, images[] }` |
| PUT    | `/admin/products/:id` *(Admin)* | Update product | Same as above |
| DELETE | `/admin/products/:id` *(Admin)* | Delete product | Path: `id` |

---

### 🛒 Cart

| Method | Endpoint        | Description         | Body / Params |
|--------|----------------|--------------------|---------------|
| POST   | `/add-to-cart`       | Add item to cart | `{ productId, quantity }` |
| GET    | `/cart`       | Get user cart | - |
| POST   | `/cart/remove/:itemId` | Remove item from cart | Path: `itemId` |
| POST   | `/cart/clear` | Clear all items in cart | - |

---

### ❤️ Wishlist

| Method | Endpoint        | Description         | Body / Params |
|--------|----------------|--------------------|---------------|
| POST   | `/add-to-wishlist` | Add to wishlist | `{ productId }` |
| GET    | `/wishlist` | Get wishlist items | - |
| POST   | `/remove-from-wishlist/:itemId` | Remove from wishlist | Path: `itemId` |

---

### 📦 Orders

| Method | Endpoint        | Description         | Body / Params |
|--------|----------------|--------------------|---------------|
| POST   | `/place-order` | Place new order | `{ cartItems[], address, paymentMethod }` |
| GET    | `/order-history` | Get logged-in user orders | - |
| GET    | `/orders/:id` | Get order details | Path: `id` |
| POST   | `/update-order-status/:id/:status` *(Admin)* | Update order status | Path: `id`, `status` |

---

### 🛠 Admin

| Method | Endpoint        | Description         |
|--------|----------------|--------------------|
| GET    | `/admin/dashboard` | Admin dashboard overview |
| GET    | `/admin/users-list` | List all users |
| GET    | `/admin/products-list` | List all products |
| GET    | `/admin/orders-list` | List all orders |

> **Note:** Protected routes require authentication headers:
```
Authorization: Bearer <token>
```

---

## 🧑‍💻 Author

**Shasbin/ ChronoRoyale**  
GitHub: https://github.com/shasbinas

---

## ⭐ Contribute

Pull requests are welcome! For major changes, please open an issue first.

---

## 📜 License

This project is licensed under **MIT License** — free to use and modify.

---

If you like this project, **please ⭐ star the repo!**
