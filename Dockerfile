# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Build arguments
ARG MONGODB_URI=mongodb://placeholder:27017/placeholder
ARG NEXTAUTH_SECRET=placeholder-secret
ARG NEXTAUTH_URL=http://localhost:3000
ARG JWT_SECRET=placeholder-jwt

# Set environment variables for build
ENV MONGODB_URI=$MONGODB_URI
ENV NEXTAUTH_SECRET=$NEXTAUTH_SECRET
ENV NEXTAUTH_URL=$NEXTAUTH_URL
ENV JWT_SECRET=$JWT_SECRET
ENV NEXT_TELEMETRY_DISABLED=1

# Copy package files first
COPY package.json package-lock.json* yarn.lock* .npmrc* ./

# Install ALL dependencies
RUN npm ci --legacy-peer-deps || npm install --legacy-peer-deps

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install dumb-init
RUN apk add --no-cache dumb-init

# Copy package files
COPY package.json package-lock.json* yarn.lock* .npmrc* ./

# Install production dependencies
RUN npm ci --only=production --legacy-peer-deps || npm install --omit=dev --legacy-peer-deps

# Copy built application and dependencies
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

# Runtime environment variables (will be overridden by docker-compose)
ENV NODE_ENV=production
ENV PORT=8080
ENV NEXT_TELEMETRY_DISABLED=1

EXPOSE 8080

ENTRYPOINT ["dumb-init", "--"]
CMD ["npm", "start"]