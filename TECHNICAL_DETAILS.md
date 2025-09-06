# EcoFinds Technical Details

This document explains how the main features are implemented under the hood. It is intended for developers who want to understand the architecture and code paths.

## Architecture Overview
- Monorepo structure with backend (Express) and frontend (React) under `client/`
- MongoDB for persistence, accessed via Mongoose models
- JWT-based stateless authentication
- Axios on the client with an interceptor for attaching tokens
- Docker Compose orchestrates `mongodb`, `backend`, and `frontend`

## Data Models (`models/`)
- `User.js`
  - Fields: `firstName`, `lastName`, `email`, `username`, `passwordHash`, `avatar`, `bio`
  - Indexes for `email`, `username`
  - Methods: password hashing, comparison
- `Product.js`
  - Fields: `title`, `description`, `category`, `condition`, `price`, `images[]`, `seller`, `tags[]`, `available`
  - Indexes: text index on `title` and `description` for search
- `Cart.js`
  - Embedded items with `product`, `quantity`, `price`
  - `totalAmount` pre-save computation
- `Purchase.js`
  - Items with `product`, `seller`, `price`, `quantity`
  - `buyer`, `status`, `shippingAddress`, `paymentMethod`

## Authentication (`routes/auth.js`, `middleware/auth.js`)
- Registration and Login endpoints issue JWT tokens signed with `JWT_SECRET`
- `auth` middleware extracts the token from `Authorization: Bearer <token>` and attaches `req.user`
- Protected routes use `auth` to ensure valid tokens

## Product APIs (`routes/products.js`)
- CRUD endpoints with authorization checks (only owner can edit/delete)
- Search and filters via query params: `search`, `category`, `condition`, `minPrice`, `maxPrice`, `sort`, `page`, `limit`
- Like/Unlike routes update a `likes` array or counter

## Cart APIs (`routes/cart.js`)
- `GET /api/cart` returns the current user's cart
- `POST /api/cart/add` to add a product/quantity
- `PUT /api/cart/update` to change quantity
- `DELETE /api/cart/remove/:productId` to remove an item
- `DELETE /api/cart/clear` clears the cart
- `POST /api/cart/checkout` creates a `Purchase` and sets product availability

## User APIs (`routes/users.js`)
- `GET /api/users/me` returns authenticated user
- `PUT /api/users/me` updates profile fields
- `GET /api/users/:id` public profile
- `GET /api/users/me/listings` returns current user's products
- `GET /api/users/me/purchases` paginated purchase history

## Frontend State & API (`client/src/`)
- `contexts/AuthContext.js`
  - Persists token in `localStorage`
  - Provides `login`, `register`, `logout`, `updateUser`, `user`
  - Uses Axios instance (`config/axios.js`) which injects token and auto-redirects on 401
- `contexts/CartContext.js`
  - Methods: `fetchCart`, `addToCart`, `updateItem`, `removeItem`, `clearCart`, `checkout`
  - Derived helpers: `getCartItemCount`
- Pages
  - `ProductListing.js`: search, filters, pagination
  - `ProductDetail.js`: product info, add to cart, seller info
  - `MyListings.js`: manage own products
  - `AddProduct.js`: create new listing (image preview UI)
  - `PurchaseHistory.js`: friendly order breakdown

## Security & Validation
- `express-validator` on inputs
- `helmet` for secure headers
- `express-rate-limit` against abuse
- `bcryptjs` for password hashing

## Environment & Config
- Backend reads from `process.env` with sensible defaults
- Frontend reads `REACT_APP_*` vars (compose sets `REACT_APP_API_URL`)
- In Docker: services communicate over an internal bridge network (frontend → backend via `http://backend:5000`)

## Logging & Error Handling
- Centralized Express error handler with friendly messages
- Client shows user-friendly alerts on failures

## Future Enhancements
- Enable real image uploads via Cloudinary SDK
- Add payments integration (Stripe) in checkout
- Add Admin dashboard and moderation
- Add e2e tests (Playwright/Cypress) and unit tests (Jest)
