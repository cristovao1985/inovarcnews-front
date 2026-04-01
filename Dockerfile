# ---------- BUILD ----------
FROM node:20-alpine AS build

WORKDIR /app
COPY . .

RUN npm install
RUN npm run build:pwa

# ---------- PRODUCTION ----------
FROM node:20-alpine

WORKDIR /app

RUN npm install -g serve

COPY --from=build /app/dist/pwa ./dist/pwa

EXPOSE 80

CMD ["serve", "-s", "dist/pwa", "-l", "80"]