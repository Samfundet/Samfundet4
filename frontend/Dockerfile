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

# Start dev server
CMD ["yarn", "start:docker", "--host", "0.0.0.0", "--port", "3000"]
