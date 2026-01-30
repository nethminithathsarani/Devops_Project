# Backend image: multi-stage keeps runtime small and caches deps.

# Stage 1 - deps (cached when package*.json unchanged)
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Stage 2 - runtime
FROM node:18-alpine
WORKDIR /app
ENV NODE_ENV=production

# Copy only node_modules from deps stage, then app source.
COPY --from=deps /app/node_modules ./node_modules
COPY . .

EXPOSE 5000
CMD ["npm", "start"]