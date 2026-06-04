# ──────────────────────────────────────────────────────────────
# Frontend Dockerfile — EduVNU React/Vite
#
# Stage 1: build với Node.js
# Stage 2: serve bằng Nginx (nhẹ, production-ready)
# ──────────────────────────────────────────────────────────────

# ── Stage 1: Build ────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Cài dependencies trước (cache layer)
COPY package*.json ./
RUN npm ci --silent

# Copy source và build
COPY . .

# VITE_API_URL sẽ được inject lúc build (qua docker-compose build args)
ARG VITE_API_URL=/api/v1
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# ── Stage 2: Serve với Nginx ───────────────────────────────────
FROM nginx:alpine

# Config Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built React app
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
