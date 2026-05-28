# Blossom Studio

Modern full-stack MERN e-commerce website for the BCA final year project **"E-Commerce System for Handmade Craft Products."**

## Tech Stack

- React.js + Tailwind CSS frontend
- Node.js + Express.js backend
- MongoDB + Mongoose
- JWT authentication
- Razorpay payment flow
- Cloudinary image upload
- REST API architecture

## Project Structure

```text
frontend/
backend/
```

## Quick Start

1. Install backend dependencies:

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

2. Install frontend dependencies:

```bash
cd frontend
npm install
npm run dev
```

3. Open the frontend URL shown by Vite.

## Demo Admin

After configuring MongoDB, seed sample products and an admin user:

```bash
cd backend
npm run seed
```

Default seeded admin:

- Email: `admin@blossomstudio.in`
- Password: `admin123`

## Main API Modules

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/products`
- `POST /api/products` admin only
- `POST /api/products/upload` admin only, Cloudinary
- `GET /api/cart`
- `POST /api/orders`
- `POST /api/payments/razorpay-order`
- `POST /api/payments/verify`
- `GET /api/admin/stats`

## Notes

The frontend includes a local sample catalog fallback, so the UI remains presentable even before
MongoDB is connected. Once the backend is running, the product listing automatically uses the REST
API.
