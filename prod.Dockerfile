# Build for production
FROM node:20-alpine as builder

WORKDIR /usr/app/client

COPY package.json package-lock.json ./
RUN npm i

COPY . .
RUN npm run build

# Production
FROM caddy:2.7.4-alpine as runner

COPY --from=builder /usr/app/client/dist /srv

