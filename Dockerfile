# ---------- STAGE 1: BUILD ----------
FROM node:20-slim AS build

# Diretório da aplicação
WORKDIR /app

# Copia apenas package.json e lock primeiro (melhor cache)
COPY package*.json ./

# Instala dependências de forma determinística
RUN npm ci

# Copia o restante do projeto
COPY . .

# Build do Quasar PWA
RUN npm run build:pwa


# ---------- STAGE 2: PRODUCTION ----------
FROM nginx:alpine

# Remove config padrão do nginx
RUN rm -rf /usr/share/nginx/html/*

# Copia build gerado
COPY --from=build /app/dist/pwa /usr/share/nginx/html

# Copia config custom (SPA fallback)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expor porta
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]