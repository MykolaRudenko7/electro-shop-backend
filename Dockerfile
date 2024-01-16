FROM node:20.10.0-alpine

RUN npm install -g nodemon

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm ci

COPY . .

EXPOSE 3001

ENV PORT 3001

ENV HOSTNAME "0.0.0.0"

CMD [ "node", "server.js" ]