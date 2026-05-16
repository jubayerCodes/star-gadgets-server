# Star Gadgets — Server (Express API)

## Project Overview

Star Gadgets is a full-stack e-commerce platform for gadgets and electronics. This is the **server** application — a RESTful API built with Express 5 and Mongoose 9. The frontend is a separate Next.js 16 application located at `../star-gadgets-client`.

- **Server** runs on port `5000` — `pnpm dev`
- **Client** runs on port `8000` — `pnpm dev` (from client directory)
- **API base path:** `/api/v1`
- Docker Compose is available at the parent directory for containerized deployment

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js with TypeScript |
| Framework | Express 5 |
| Database | MongoDB via Mongoose 9 |
| Auth | JWT (access + refresh tokens in HTTP-only cookies), Passport.js (Google OAuth) |
| Validation | Zod v4 |
| File Uploads | Multer + Cloudinary |
| Payments | SSLCommerz |
| PDF | PDFKit |
| Password | bcryptjs |
| Package Manager | pnpm |
| Dev Runner | ts-node-dev (with `--respawn`) |

---

## Directory Structure

```
src/
├── app/
│   ├── config/                  # Configuration files
│   │   ├── env.ts               # Environment variable loader (typed, validated)
│   │   ├── cloudinary.config.ts # Cloudinary SDK setup
│   │   ├── multer.config.ts     # Multer storage config (Cloudinary)
│   │   └── passport.ts          # Passport Google OAuth strategy
│   ├── constants/               # App-wide constants
│   ├── errorHelpers/            # Error classes and formatters
│   │   ├── AppError.ts          # Custom error class (statusCode + message)
│   │   ├── handleZodError.ts    # Zod validation error formatter
│   │   ├── handleValidationError.ts  # Mongoose validation error formatter
│   │   ├── handleCastError.ts   # Mongoose cast error formatter
│   │   └── handleDuplicateError.ts   # MongoDB duplicate key error formatter
│   ├── interfaces/              # Shared TypeScript interfaces
│   ├── middlewares/
│   │   ├── checkAuth.ts         # JWT auth + role-based access control
│   │   ├── softAuth.ts          # Optional auth (attaches user if present)
│   │   ├── validateRequest.ts   # Zod request body validation
│   │   ├── globalErrorHandler.ts # Centralized error handling
│   │   └── notFound.ts          # 404 handler
│   ├── modules/                 # Feature modules (see Module Pattern below)
│   ├── routes/
│   │   └── index.ts             # Route registry — maps paths to module routers
│   ├── utils/                   # Utility functions
│   │   ├── catchAsync.ts        # Async route handler wrapper
│   │   ├── sendResponse.ts      # Standardized JSON response helper
│   │   ├── setCookie.ts         # Auth cookie helper
│   │   ├── jwt.ts               # JWT sign/verify helpers
│   │   ├── userTokens.ts        # Access/refresh token creation
│   │   ├── getUserFromReq.ts    # Extract decoded user from request
│   │   ├── extractSearchQuery.ts # Parse pagination/search from query params
│   │   ├── getSearchQuery.ts    # Build MongoDB search query
│   │   └── getFuzzyRegex.ts     # Fuzzy regex for search
│   └── validations/             # Shared validation schemas (e.g., phone number)
├── app.ts                       # Express app configuration (cors, middleware, routes)
└── server.ts                    # Entry point (MongoDB connection, process signal handlers)
```

---

## Module Pattern

Every module follows this exact structure under `src/app/modules/<Module>/`:

```
src/app/modules/<Module>/
├── <name>.interface.ts      # TypeScript interfaces and enums
├── <name>.model.ts          # Mongoose Schema + Model
├── <name>.validation.ts     # Zod schemas for request validation
├── <name>.controller.ts     # Route handler functions (wrapped with catchAsync)
├── <name>.service.ts        # Business logic (called by controllers)
├── <name>.route.ts          # Express Router with endpoint definitions
```

### Current Modules (13)

| Module | Route Prefix | Key Endpoints |
|---|---|---|
| **Auth** | `/auth` | `POST /login`, `POST /refresh-token`, `POST /logout`, `POST /reset-password`, `GET /google`, `GET /google/callback` |
| **User** | `/users` | `POST /` (register), `GET /` (admin list), `GET /me`, `PATCH /me` |
| **Product** | `/products` | Full CRUD + `GET /featured`, `/search`, `/listing`, `/category/:slug`, `/sub-category/:slug`, `/slug/:slug` |
| **Order** | `/orders` | `POST /` (softAuth), `GET /` (admin), `GET /my`, `GET /:id`, `PATCH /:id/cancel`, `PATCH /:id/status` |
| **Payment** | `/payments` | `POST /initiate/:orderId`, `GET /order/:orderId`, `GET /transaction/:transactionId`, SSLCommerz callbacks |
| **Category** | `/categories` | Standard CRUD |
| **Sub-Category** | `/sub-categories` | Standard CRUD |
| **Brand** | `/brands` | Standard CRUD |
| **Badge** | `/badges` | Standard CRUD |
| **Coupon** | `/coupons` | Standard CRUD |
| **Configuration** | `/config` | Site config management |
| **Upload** | `/uploads` | Cloudinary image upload via Multer |
| **SslCommerz** | (internal) | SSLCommerz payment helper |

---

## Code Conventions

### Controller Pattern

- Every handler is wrapped with `catchAsync()` to auto-forward errors to `globalErrorHandler`
- Use `sendResponse()` for all successful responses
- Use `getUserFromReq(req)` to access the authenticated user
- Use `extractSearchQuery()` to parse pagination params from `req.query`
- Export as a named object: `export const <Module>Controllers = { ... }`

```typescript
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";

const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await UserServices.createUser(req.body);

  setAuthCookie(res, result);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    data: result.user,
    message: "User created successfully",
    success: true,
  });
});

export const UserControllers = {
  createUser,
};
```

### Service Pattern

- Contains all business logic and database operations
- Throws `AppError` for error cases
- Export as a named object: `export const <Module>Services = { ... }`

```typescript
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";

const createUser = async (payload: IUser) => {
  const existing = await User.findOne({ email: payload.email });
  if (existing) {
    throw new AppError(httpStatus.BAD_REQUEST, "User already exists");
  }
  // ... business logic
};

export const UserServices = {
  createUser,
};
```

### Route Pattern

- Create router with `Router()`
- Apply middleware in order: `checkAuth(roles)` → `validateRequest(schema)` → controller
- Export as: `export const <Module>Routes = Router()`

```typescript
import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";

export const UserRoutes = Router();

UserRoutes.post("/", validateRequest(createUserZodSchema), UserControllers.createUser);
UserRoutes.get("/", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), UserControllers.getAllUsers);
UserRoutes.get("/me", checkAuth(...Object.values(Role)), UserControllers.getProfile);
```

### Validation Pattern

- Use Zod v4 for request body validation
- Export schemas directly (not wrapped in objects)
- Naming: `<verb><Entity>ZodSchema` or `<verb><Entity>Validation`

```typescript
import z from "zod";

export const createUserZodSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.email(),
  password: z.string().min(8),
});
```

### Interface Pattern

- Interfaces prefixed with `I`: `IUser`, `IProduct`, `IOrder`
- Enums use PascalCase: `Role`, `OrderStatus`, `ProductStatus`
- Use Mongoose `Types.ObjectId` for reference fields

```typescript
import { Types } from "mongoose";

export enum Role {
  USER = "USER",
  ADMIN = "ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN",
}

export interface IUser {
  name: string;
  email: string;
  password?: string;
  role: Role;
}
```

### Route Registration (`src/app/routes/index.ts`)

All module routes are centrally registered in a `moduleRoutes` array:

```typescript
const moduleRoutes = [
  { path: "/auth", route: AuthRoutes },
  { path: "/users", route: UserRoutes },
  // ...
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
```

---

## Response Format

All API responses follow this standardized shape:

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Description of what happened",
  "data": { },
  "meta": {
    "page": 1,
    "total": 50,
    "limit": 10,
    "skip": 0
  }
}
```

- `meta` is included for paginated responses
- Error responses set `success: false` with the error `message`

---

## Authentication System

### JWT Tokens

- **Access token:** Short-lived, stored in `accessToken` HTTP-only cookie
- **Refresh token:** Long-lived, stored in `refreshToken` HTTP-only cookie
- Tokens contain: `userId`, `email`, `role`
- Created via `createUserTokens()` utility
- Verified via `verifyToken()` utility

### Middleware

| Middleware | Purpose |
|---|---|
| `checkAuth(...roles)` | Requires valid JWT, checks user has one of the specified roles. Extracts token from `req.cookies.accessToken` |
| `softAuth` | Attaches user to request if token is present, proceeds without error if not (used for guest checkout) |
| `validateRequest(schema)` | Validates `req.body` against a Zod schema, throws formatted error on failure |

### Google OAuth

- Passport strategy configured in `src/app/config/passport.ts`
- Flow: Client redirects to `GET /auth/google` → Google consent → `GET /auth/google/callback` → Server sets cookies → Redirects to client

---

## Error Handling

### AppError Class

```typescript
class AppError extends Error {
  public statusCode: number;
  constructor(statusCode: number, message: string, stack = "") { ... }
}
```

### Global Error Handler

The `globalErrorHandler` middleware catches all errors and normalizes them:

- **Zod errors** → formatted validation messages
- **Mongoose ValidationError** → field-level error messages
- **Mongoose CastError** → "Invalid ID" type messages
- **MongoDB duplicate key** → "Already exists" messages
- **AppError** → uses provided statusCode and message
- **Unknown errors** → 500 Internal Server Error

---

## Environment Variables

All required env vars are validated at startup via `src/app/config/env.ts`. The app will crash immediately if any are missing.

| Variable | Purpose |
|---|---|
| `PORT` | Server port (default: 5000) |
| `DB_URL` | MongoDB connection string |
| `CLIENT_URL` | Frontend URL (for CORS) |
| `SERVER_URL` | Server's own URL |
| `NODE_ENV` | DEVELOPMENT or PRODUCTION |
| `JWT_SECRET`, `JWT_EXPIRES_IN` | Access token config |
| `JWT_REFRESH_SECRET`, `JWT_REFRESH_EXPIRES_IN` | Refresh token config |
| `BCRYPT_SALT_ROUNDS` | Password hashing rounds |
| `CLOUDINARY_*` | Cloudinary credentials |
| `SSL_*` | SSLCommerz payment gateway config |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_CALLBACK_URL` | Google OAuth |

---

## Key Data Models

### User
`name`, `email`, `password?`, `avatar?`, `phone?`, `role` (USER|ADMIN|SUPER_ADMIN), `billingAddress?`, `shippingAddress?` (IAddress), `auths[]` (provider: LOCAL|GOOGLE, providerId), `isDeleted`, `isVerified`

### Product
`title`, `slug`, `featuredImage`, `productCode`, `keyFeatures`, `description`, `specifications[]` (heading + name/value pairs), `attributes[]` (name + values), `badges[]`, `variants[]` (attributes, price, regularPrice, stock, status, sku, images, featured), `categoryId`, `subCategoryId`, `brandId`, `isActive`, `isFeatured`, `isDeleted`

### Order
`orderNumber`, `userId?`, `billingDetails`, `shippingDetails?`, `items[]` (productId, variantId, title, image, attributes, quantity, price, subtotal), `subtotal`, `shippingMethod`, `shippingCost`, `coupon?` (couponId, code, discountAmount), `discount`, `total`, `paymentMethod`, `paymentId?`, `orderStatus` (PENDING → CONFIRMED → PROCESSING → SHIPPED → DELIVERED | CANCELLED | FAILED)

### Payment
`orderId`, `transactionId`, `paymentMethod` (COD|ONLINE), `paymentStatus` (PENDING|COMPLETED|FAILED|CANCELLED|REFUNDED), `amount`, `paidAt?`

---

## Important Patterns to Follow

1. **Always wrap controllers** with `catchAsync()` — never use try/catch in controllers
2. **Always use `sendResponse()`** — never call `res.json()` directly
3. **Always throw `AppError`** for known error cases — never throw plain Error
4. **Always use `httpStatus` constants** from `http-status-codes` — never hardcode status numbers
5. **Always validate requests** with `validateRequest(zodSchema)` middleware for POST/PATCH routes
6. **Always register routes** in `src/app/routes/index.ts`
7. **Module isolation** — Each module is self-contained with its own interface, model, validation, controller, service, and route files
8. **CORS** allows `http://localhost:8000` and `CLIENT_URL` with credentials
9. **Cookie-based auth** — Tokens are in HTTP-only cookies, not Authorization headers
10. **Path aliases** — Not used on server; imports use relative paths (`../../utils/...`)
