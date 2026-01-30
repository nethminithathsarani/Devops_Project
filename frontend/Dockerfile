# Dockerfile for React client

# Build production bundle on Node 18 (react-scripts 5 compatible)
FROM node:18-alpine

# Working directory inside container
WORKDIR /usr/src/app

COPY package*.json ./

# Install dependencies without suppressing errors
RUN npm install

# Copy application source
COPY . .

# Build optimized production assets
RUN npm run build

# Serve with serve package
RUN npm install -g serve

EXPOSE 3000

CMD ["serve", "-s", "build", "-l", "3000"]