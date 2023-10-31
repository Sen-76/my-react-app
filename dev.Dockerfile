# Build for production
FROM node:20-alpine as builder

WORKDIR /usr/app/client

COPY package.json package-lock.json ./
RUN npm i

COPY . .
RUN npm run build

# Production
FROM node:20-alpine as runner

WORKDIR /usr/app/client

RUN npm i -g http-server
COPY --from=builder /usr/app/client/dist .

EXPOSE 8080
CMD [ "http-server", "--proxy", "http://localhost:8080?" ]
