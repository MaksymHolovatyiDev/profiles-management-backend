FROM node:18

WORKDIR /app

COPY . /app

RUN npm install -g npm@9.8.1 && \
    npm install --production && \
    npm install

RUN npm run build

COPY . .

EXPOSE 8080

CMD [ "npm", "start" ]