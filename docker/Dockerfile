FROM node:22 AS builder

WORKDIR /app

COPY . .

RUN npm i

RUN npm run build

FROM node:22 AS be

WORKDIR /app

COPY --from=builder /app/dist ./
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules

CMD [ "node", "index.js" ]
