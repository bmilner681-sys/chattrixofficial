FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (including dev dependencies for TypeScript compilation)
RUN npm install

# Copy source code
COPY src ./src
COPY tsconfig.json ./

# Build TypeScript
RUN npm run build

# Create data directory for SQLite database
RUN mkdir -p ./data

# Expose port
EXPOSE 3001

# Start application
CMD ["npm", "start"]
