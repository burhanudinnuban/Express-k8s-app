# Stage 1: Build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .

# Stage 2: Production
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app .

ENV PORT=3000
EXPOSE 3000

# Run as non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

CMD ["npm", "start"]
