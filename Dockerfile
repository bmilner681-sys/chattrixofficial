FROM node:18-alpine

WORKDIR /app

# Copy server files
COPY server/package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY server/src ./src
COPY server/tsconfig.json ./

# Build TypeScript
RUN npm run build

# Create data directory for SQLite database
RUN mkdir -p ./data

# Expose port
EXPOSE 3001

# Start application
CMD ["npm", "start"]
