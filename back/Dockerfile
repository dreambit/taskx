FROM node:12-alpine

ENV NODE_ENV production

WORKDIR /usr/smartcars/backend

COPY package*.json ./

RUN npm install

COPY . .

CMD [ "node", "src/app.js" ]
