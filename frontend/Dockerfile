# ── Stage 1: Install dependencies ─────────────────────────────────────────────
FROM node:22-alpine AS deps

WORKDIR /app

# Copy lockfile + package manifests first (caching layer)
COPY package.json package-lock.json ./
RUN npm ci

# ── Stage 2: Build Next.js ────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

# Pull in node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# NEXT_PUBLIC_* vars are baked in at build time.
# We read them from build args so the image stays portable.
ARG NEXT_PUBLIC_API_URL=http://localhost:8081
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Enable standalone output — must be a build ARG so next.config.ts can read it at build time
ARG DOCKER_BUILD=true
ENV DOCKER_BUILD=$DOCKER_BUILD

# Internal backend URL for server-side rewrites — must be baked in at build time
# Default points to the Docker service name "backend"
ARG BACKEND_INTERNAL_URL=http://backend:8081
ENV BACKEND_INTERNAL_URL=$BACKEND_INTERNAL_URL

# Disable Next.js telemetry inside Docker
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# ── Stage 3: Production runner ────────────────────────────────────────────────
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Non-root user
RUN addgroup -S nextjs && adduser -S nextjs -G nextjs
USER nextjs

# Copy only what Next.js needs to serve the app
COPY --from=builder --chown=nextjs:nextjs /app/public ./public
COPY --from=builder --chown=nextjs:nextjs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nextjs /app/.next/static ./.next/static

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Use the standalone server Next.js emits (much lighter than next start)
CMD ["node", "server.js"]
