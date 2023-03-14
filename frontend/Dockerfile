# For cypress dependencies use cypress image, eg. cypress/base:19
FROM node:19.3-bullseye-slim
EXPOSE 3000
WORKDIR /app

# Copy package file to docker
COPY package.json yarn.lock ./

# Require up to date package.json and yarn.lock, fail otherwise.
RUN yarn install --frozen-lockfile

# Copy remaining files
COPY . /app

# Commands are run from docker-compose
# to use same image for storybook and vite
