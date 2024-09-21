# Production stage
FROM node:20-alpine

ENV NODE_ENV=production

WORKDIR /app

COPY dist ./dist
COPY package.json ./package.json

RUN cd /app && npm install --omit=dev

# Expose port 3000
EXPOSE 3000

# Start the server
CMD ["node", "/app/dist/main"]