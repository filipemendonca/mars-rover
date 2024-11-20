# Use uma imagem base do Node.js para build
FROM node:18 AS build

# Define o diretório de trabalho no contêiner
WORKDIR /app

# Copia os arquivos necessários para o contêiner
COPY package*.json ./
RUN npm install

# Copia o restante do código
COPY . .

# Compila o código do Vue 3
RUN npm run build

# Use uma imagem mais leve para servir os arquivos estáticos
FROM nginx:stable-alpine

# Copia os arquivos estáticos para o nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copia o arquivo de configuração do nginx (opcional)
# COPY nginx.conf /etc/nginx/nginx.conf

# Expõe a porta usada pelo nginx
EXPOSE 80

# Comando padrão para iniciar o nginx
CMD ["nginx", "-g", "daemon off;"]
