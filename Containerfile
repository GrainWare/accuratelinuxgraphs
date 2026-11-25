# --- Builder Stage ---
FROM node:slim AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

RUN npm prune --production

# --- Final Stage ---
FROM node:slim
WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package.json .

EXPOSE 4321
ENV NODE_ENV=production
ENV PORT=4321
ENV HOST=0.0.0.0

CMD [ "node", "dist/server/entry.mjs" ]