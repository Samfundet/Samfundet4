# For cypress dependencies use cypress image, eg. cypress/base:19

FROM node:21-slim
EXPOSE 3000
WORKDIR /app

# Copy package file to docker.
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn/ /app/.yarn/

# Require up to date package.json and yarn.lock, fail otherwise.
RUN yarn install --immutable

# Copy remaining files.
COPY . /app/

# Aliases:
RUN echo 'alias la="ls -la"' >> ~/.bashrc

# Commands are run from docker-compose to use the same image for storybook and vite.
