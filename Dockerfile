# ---- Build stage ----
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy lockfile and manifest first (layer cache for deps)
COPY pnpm-lock.yaml package.json ./

# Install ALL deps (including devDeps needed for tsc)
RUN pnpm install --frozen-lockfile

# Copy source and compile TypeScript → dist/
COPY . .
RUN pnpm build


# ---- Production stage ----
FROM node:20-alpine AS runner

WORKDIR /app

RUN npm install -g pnpm

# Only copy what's needed for runtime
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/dist ./dist

# Install production deps only
RUN pnpm install --frozen-lockfile --prod

# Never run as root in production
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

EXPOSE 5000

CMD ["node", "dist/server.js"]