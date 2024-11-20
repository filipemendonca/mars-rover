# Use uma imagem base do Node.js
FROM node:18

# Define o diretório de trabalho no contêiner
WORKDIR /app

# Copia os arquivos necessários para o contêiner
COPY package*.json ./
RUN npm install

# Copia o restante do código
COPY . .

# Compila o código (se necessário)
RUN npm run build

# Expõe a porta do backend
EXPOSE 3000

# Comando para iniciar o backend
CMD ["npm", "run", "start"]
