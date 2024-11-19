FROM node:18-alpine

LABEL authors="Fiore Nunzio"

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080

CMD ["npm", "run", "start-server"]