# Frontend image: multi-stage (build → nginx) to serve static bundle efficiently.

# Stage 1 - build React app. Use path-aware COPY because build context is repo root.
FROM node:18-alpine AS build
WORKDIR /app
COPY frontend/package*.json ./
RUN npm ci --legacy-peer-deps
COPY frontend/ ./
RUN npm run build

# Stage 2 - Nginx for static hosting of the compiled SPA.
FROM nginx:1.27-alpine
WORKDIR /usr/share/nginx/html
COPY --from=build /app/build ./
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]