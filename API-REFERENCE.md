# EcoFinds API Reference

Base URL (Docker): `http://localhost:5000`

Authentication: Use `Authorization: Bearer <token>` for protected endpoints.

## Auth

- POST `/api/auth/register`
  - Body: `{ "firstName", "lastName", "email", "username", "password" }`
  - Response: `{ token, user }`

- POST `/api/auth/login`
  - Body: `{ "emailOrUsername", "password" }`
  - Response: `{ token, user }`

- GET `/api/auth/me` (protected)
  - Headers: `Authorization: Bearer <token>`
  - Response: `user`

## Products

- GET `/api/products`
  - Query params: `search, category, condition, minPrice, maxPrice, sort, page, limit`
  - Response: `{ products, total, totalPages, currentPage }`

- POST `/api/products` (protected)
  - Body: `{ title, description, category, condition, price, images[], tags[], location }`
  - Response: `product`

- GET `/api/products/:id`
  - Response: `product`

- PUT `/api/products/:id` (protected, owner only)
  - Body: partial or full product payload
  - Response: `product`

- DELETE `/api/products/:id` (protected, owner only)
  - Response: `{ message }`

- POST `/api/products/:id/like` (protected)
  - Response: `{ liked: boolean, likesCount }`

## Cart

- GET `/api/cart` (protected)
  - Response: `{ items[], totalAmount }`

- POST `/api/cart/add` (protected)
  - Body: `{ productId, quantity }`
  - Response: `cart`

- PUT `/api/cart/update` (protected)
  - Body: `{ productId, quantity }`
  - Response: `cart`

- DELETE `/api/cart/remove/:productId` (protected)
  - Response: `cart`

- DELETE `/api/cart/clear` (protected)
  - Response: `cart`

- POST `/api/cart/checkout` (protected)
  - Body: `{ shippingAddress, paymentMethod, notes }`
  - Response: `{ purchase, cartCleared: true }`

## Users

- GET `/api/users/me` (protected)
  - Response: `user`

- PUT `/api/users/me` (protected)
  - Body: `{ firstName, lastName, email, username, bio, avatar }`
  - Response: `user`

- GET `/api/users/:id`
  - Response: public user info

- GET `/api/users/me/listings` (protected)
  - Query: `status, page, limit`
  - Response: `{ products, total, totalPages, currentPage }`

- GET `/api/users/me/purchases` (protected)
  - Query: `page, limit`
  - Response: `{ purchases, total, totalPages, currentPage }`

## Example: Create + List + Add to Cart + Checkout

1) Register:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Test","lastName":"User","email":"test@example.com","username":"tester","password":"Pass123!"}'
```

2) Login (save token):
```bash
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"emailOrUsername":"tester","password":"Pass123!"}' | jq -r .token)
```

3) Create product:
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Eco Bottle","description":"Reusable bottle","category":"Home","condition":"like_new","price":9.99}'
```

4) List products:
```bash
curl http://localhost:5000/api/products?search=bottle
```

5) Add to cart:
```bash
curl -X POST http://localhost:5000/api/cart/add \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"productId":"<PRODUCT_ID>","quantity":1}'
```

6) Checkout:
```bash
curl -X POST http://localhost:5000/api/cart/checkout \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"shippingAddress":{"street":"123 Green St","city":"Eco City","state":"CA","zipCode":"90000","country":"USA"},"paymentMethod":"cash"}'
```
