FROM node:19.3-bullseye-slim

# Update packages and install Cypress dependencies.
RUN apt update -y \
    && apt upgrade -y \
    && apt install -y --no-install-recommends libgtk2.0-0 libgtk-3-0 libgbm-dev libnotify-dev libgconf-2-4 libnss3 libxss1 libasound2 libxtst6 xauth xvfb \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json yarn.lock ./

# Require up to date package.json and yarn.lock, fail otherwise.
RUN yarn install --frozen-lockfile

COPY . .

EXPOSE 3000

CMD ["yarn", "start:docker", "--host", "0.0.0.0", "--port", "3000"]
