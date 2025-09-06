# EcoFinds Features (Complete List)

This document lists every major feature available in EcoFinds. Use it as a checklist and reference.

## Accounts & Security
- User registration with email, username, and password
- Secure login with JWT authentication
- Persistent sessions with token storage
- Logout anywhere to invalidate session on the client
- Protected API routes using middleware

## User Profile & Dashboard
- View and edit profile (first name, last name, email, username)
- Dashboard with quick stats (listings created, items sold, likes, etc.)
- Quick links to common actions (add product, manage listings, view cart, purchase history)

## Products
- Create product listing with title, description, category, price, condition
- Upload images (designed for Cloudinary integration)
- Add tags and location (optional)
- Set availability status (available/sold)
- Edit and delete product listings
- Reactivate archived listings

## Product Discovery
- Home page with featured products and key stats
- Product listing feed with:
  - Search by title/description
  - Filter by category
  - Filter by condition
  - Sort by price/date/popularity (if enabled)
  - Pagination
- Product details page with:
  - Image gallery
  - Seller info
  - Description, price, condition, tags
  - Related items suggestion (if available)

## Social / Engagement
- Like/unlike products
- View like counts

## Cart & Checkout
- Add to cart from product card and detail page
- Update quantity in cart
- Remove items from cart
- Clear entire cart
- Checkout flow with shipping details and payment method placeholder
- Order creation on checkout and stock/availability updates

## Purchases
- Purchase history page with:
  - Order ID, date, total
  - Item breakdown with images, sellers, subtotals
  - Shipping address summary
  - Payment method label
  - Order status (pending/confirmed/shipped/delivered/cancelled)

## Admin-Ready Design (Optional)
- Back-end endpoints structured to support admin actions in the future
- Mongoose schemas with indexes suitable for reports and dashboards

## Performance & UX
- Loading skeletons for smoother perceived performance
- Responsive design for mobile/tablet/desktop
- FontAwesome icons for visuals
- Modern card-based UI with subtle animations

## Code Quality & Security
- Input validation with express-validator (backend)
- Password hashing with bcryptjs
- Rate limiting and Helmet for security hardening
- Protected routes and consistent error handling

## Dev & Ops
- Dockerized (MongoDB + Backend + Frontend)
- One-click scripts (start/stop/logs)
- Centralized Axios config with auth interceptor
- Environment variable driven configuration
