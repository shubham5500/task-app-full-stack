FROM node:20-alpine

WORKDIR /usr/src/task-fe

COPY package*.json .

RUN npm i

RUN npm i node-pg-migrate

COPY . .

EXPOSE 8080

CMD [ "npm", "run", "dev" ]