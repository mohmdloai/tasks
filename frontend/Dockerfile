# Multi-stage build for production-ready Docker image

# Stage 1: Build stage
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files for dependency installation
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Production stage
FROM node:20-alpine AS production

# Install serve for static file serving
RUN npm install -g serve

# Set working directory
WORKDIR /app

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Create entrypoint script for runtime environment variable injection
RUN echo '#!/bin/sh' > /docker-entrypoint.sh && \
    echo 'set -e' >> /docker-entrypoint.sh && \
    echo '' >> /docker-entrypoint.sh && \
    echo '# Generate runtime config file with environment variables' >> /docker-entrypoint.sh && \
    echo 'cat > /app/dist/config.js << EOF' >> /docker-entrypoint.sh && \
    echo 'window.__ENV__ = {' >> /docker-entrypoint.sh && \
    echo '  VITE_API_URL: "${VITE_API_URL:-http://localhost:3000}"' >> /docker-entrypoint.sh && \
    echo '};' >> /docker-entrypoint.sh && \
    echo 'EOF' >> /docker-entrypoint.sh && \
    echo '' >> /docker-entrypoint.sh && \
    echo 'echo "Runtime config generated with VITE_API_URL=${VITE_API_URL:-http://localhost:3000}"' >> /docker-entrypoint.sh && \
    echo '' >> /docker-entrypoint.sh && \
    echo '# Start serve' >> /docker-entrypoint.sh && \
    echo 'exec serve -s dist -l 3000' >> /docker-entrypoint.sh && \
    chmod +x /docker-entrypoint.sh

# Expose port 3000
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000 || exit 1

# Start with runtime config
ENTRYPOINT ["/docker-entrypoint.sh"]
