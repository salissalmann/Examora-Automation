FROM node:20-slim

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

# Fly.io injects PORT automatically (default 8080)
ENV NODE_ENV=production

CMD ["node", "server.js"]
