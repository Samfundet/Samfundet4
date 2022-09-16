FROM node:18.8.0-buster-slim

WORKDIR /app

COPY package.json yarn.lock ./

# Require up to date package.json and yarn.lock, fail otherwise.
RUN yarn install --frozen-lockfile

COPY . .

EXPOSE 3000

CMD ["yarn", "start", "--host", "0.0.0.0", "--port", "3000"]
