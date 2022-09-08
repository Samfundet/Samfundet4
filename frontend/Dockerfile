FROM node:18.8.0-buster-slim

WORKDIR /app

COPY package.json ./

RUN yarn install

COPY . .

EXPOSE 3000

CMD ["yarn", "start", "--host", "0.0.0.0", "--port", "3000"]
