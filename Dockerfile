# Build do front + API em uma imagem só.
FROM node:22-alpine AS build
WORKDIR /app

COPY package*.json ./
COPY shared/package.json ./shared/
COPY web/package.json ./web/
COPY server/package.json ./server/
RUN npm ci

COPY . .
RUN npm run build

# Imagem final: só o necessário para rodar.
FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
COPY shared/package.json ./shared/
COPY server/package.json ./server/
COPY web/package.json ./web/
RUN npm ci --omit=dev && npm cache clean --force

COPY shared ./shared
COPY server ./server
COPY --from=build /app/web/dist ./web/dist

EXPOSE 3000
CMD ["node", "server/src/index.js"]
