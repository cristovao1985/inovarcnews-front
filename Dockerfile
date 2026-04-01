# 1️⃣ Imagem base
FROM node:20.20.0-slim

# 2️⃣ Diretório de trabalho
WORKDIR /app

# 3️⃣ Copia todos os arquivos do projeto
COPY . .

ENV NODE_OPTIONS="--max-old-space-size=1024"

# 4️⃣ Instala dependências
RUN npm install

# 5️⃣ Build SPA do Quasar
RUN npm run build:pwa

# 6️⃣ Instala o servidor estático globalmente
RUN npm install -g serve

# 7️⃣ Expondo a porta 80
EXPOSE 80

# 8️⃣ Comando para servir SPA
CMD ["serve", "-s", "dist/pwa", "-l", "80"]
