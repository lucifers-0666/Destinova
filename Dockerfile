# ================================
# Destinova - Production Dockerfile
# Multi-stage build for optimized image size
# ================================

# Stage 1: Build stage
FROM node:20-alpine AS builder

# Add necessary packages for native dependencies
RUN apk add --no-cache python3 make g++

# Set working directory
WORKDIR /app

# Copy package files first (for better layer caching)
COPY package*.json ./
COPY tsconfig.json ./

# Install all dependencies (including devDependencies for build)
RUN npm ci

# Copy source code
COPY src/ ./src/

# Build TypeScript
RUN npm run build

# Remove dev dependencies after build
RUN npm prune --production

# Stage 2: Production stage
FROM node:20-alpine AS production

# Security: Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S destinova -u 1001 -G nodejs

# Set working directory
WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Copy built application from builder stage
COPY --from=builder --chown=destinova:nodejs /app/dist ./dist
COPY --from=builder --chown=destinova:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=destinova:nodejs /app/package*.json ./

# Copy static files
COPY --chown=destinova:nodejs html/ ./html/
COPY --chown=destinova:nodejs css/ ./css/
COPY --chown=destinova:nodejs js/ ./js/
COPY --chown=destinova:nodejs site-images/ ./site-images/
COPY --chown=destinova:nodejs views/ ./views/

# Create logs directory
RUN mkdir -p logs && chown destinova:nodejs logs

# Create uploads directory
RUN mkdir -p uploads && chown destinova:nodejs uploads

# Switch to non-root user
USER destinova

# Set environment variables
ENV NODE_ENV=production \
    PORT=4000

# Expose port
EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:4000/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })" || exit 1

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["node", "dist/server.js"]
