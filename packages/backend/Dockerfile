# Production stage
FROM node:20-alpine

WORKDIR /app

COPY dist ./dist
COPY package.json ./package.json
COPY package-lock.json ./package-lock.json

RUN cd /app && npm ci --no-fund --omit dev 

# Expose port 3000
EXPOSE 3000

# Start the server
CMD ["node", "/app/dist/main"]