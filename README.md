# Star Gadgets — Server

Backend API for the **Star Gadgets** e-commerce platform, built with **Node.js**, **Express**, **TypeScript**, and **MongoDB**.

---

## Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **Auth**: JWT (Access + Refresh tokens)
- **Payments**: SSLCommerz
- **Storage**: Cloudinary
- **Package Manager**: pnpm

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- pnpm
- MongoDB instance (local or Atlas)

### Installation

```bash
pnpm install
```

### Development

```bash
pnpm dev
```

### Build

```bash
pnpm build
```

### Lint

```bash
pnpm lint
```

---

## Environment Variables

Copy `.env.example` to `.env` and fill in the values.

```bash
cp .env.example .env
```

### General

| Variable    | Description                             | Example         |
| ----------- | --------------------------------------- | --------------- |
| `PORT`      | Port the server listens on              | `5000`          |
| `DB_URL`    | MongoDB connection string               | `mongodb://...` |
| `CLIENT_URL`| Frontend base URL (for CORS/redirects)  | `http://localhost:3000` |
| `SERVER_URL`| Backend base URL                        | `http://localhost:5000` |
| `NODE_ENV`  | Environment mode                        | `DEVELOPMENT`   |

### JWT

| Variable               | Description                        | Example     |
| ---------------------- | ---------------------------------- | ----------- |
| `JWT_SECRET`           | Secret key for access tokens       | `...`       |
| `JWT_EXPIRES_IN`       | Access token expiry                | `7d`        |
| `JWT_REFRESH_SECRET`   | Secret key for refresh tokens      | `...`       |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token expiry             | `30d`       |

### Bcrypt

| Variable            | Description                  | Example |
| ------------------- | ---------------------------- | ------- |
| `BCRYPT_SALT_ROUNDS`| Number of bcrypt salt rounds | `12`    |

### Cloudinary

| Variable                | Description                  |
| ----------------------- | ---------------------------- |
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name   |
| `CLOUDINARY_API_KEY`    | Cloudinary API key           |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret        |

### SSLCommerz

| Variable              | Description                                                         |
| --------------------- | ------------------------------------------------------------------- |
| `SSL_STORE_ID`        | SSLCommerz store ID                                                 |
| `SSL_STORE_PASS`      | SSLCommerz store password                                           |
| `SSL_PAYMENT_API`     | SSLCommerz payment initiation API endpoint                         |
| `SSL_VALIDATION_API`  | SSLCommerz transaction validation API endpoint                     |
| `SSL_IPN_URL`         | Instant Payment Notification (IPN) URL — called by SSLCommerz after a transaction to verify payment status server-to-server |

#### SSL Redirect URLs — Backend

| Variable                  | Description                                              |
| ------------------------- | -------------------------------------------------------- |
| `SSL_SUCCESS_BACKEND_URL` | Backend URL SSLCommerz redirects to on payment success  |
| `SSL_FAIL_BACKEND_URL`    | Backend URL SSLCommerz redirects to on payment failure  |
| `SSL_CANCEL_BACKEND_URL`  | Backend URL SSLCommerz redirects to on payment cancel   |

#### SSL Redirect URLs — Frontend

| Variable                   | Description                                                |
| -------------------------- | ---------------------------------------------------------- |
| `SSL_SUCCESS_FRONTEND_URL` | Frontend URL the server redirects to after payment success |
| `SSL_FAIL_FRONTEND_URL`    | Frontend URL the server redirects to after payment failure |
| `SSL_CANCEL_FRONTEND_URL`  | Frontend URL the server redirects to after payment cancel  |

---

## Project Structure

```
src/
├── app/
│   ├── config/         # Environment variable loader
│   ├── errorHelpers/   # Custom AppError class & error handlers
│   ├── middlewares/     # Auth, error handling middleware
│   ├── modules/
│   │   ├── Auth/
│   │   ├── BillingDetails/
│   │   ├── Coupon/
│   │   ├── Order/
│   │   ├── Payment/
│   │   ├── Product/
│   │   ├── SslCommerz/
│   │   └── User/
│   ├── routes/         # Root router
│   └── utils/          # Shared utilities
└── server.ts
```

---

## License

Private — All rights reserved.
