FROM node:latest

EXPOSE 3000

WORKDIR /var/local/server

COPY app.js /var/local/server
COPY package.json /var/local/server

RUN npm install

ENTRYPOINT npm run dev