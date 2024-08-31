# Etapa 1: Construção
FROM node:18 AS build

# Diretório de trabalho
WORKDIR /usr/src/app

# Copiar o package.json e package-lock.json (ou yarn.lock)
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar o código fonte
COPY . .

# Compilar o TypeScript
RUN npm run build

# Etapa 2: Produção
FROM node:18

# Diretório de trabalho
WORKDIR /usr/src/app

# Copiar apenas os arquivos necessários da etapa de construção
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules ./node_modules

# Definir a variável de ambiente para o Node
ENV NODE_ENV=production

# Expor a porta em que o servidor vai rodar
EXPOSE 3000

# Comando para rodar a aplicação
CMD ["node", "dist/index.js"]
