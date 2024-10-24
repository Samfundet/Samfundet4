[**&larr; Back: Documentation Overview**](../../README.md)

# Cypress Setup Documentation

This document outlines the steps for setting up Cypress in your project. Cypress is an end-to-end testing framework designed to make it easy to write and run tests for web applications. This guide will cover how to set up Cypress both in a Docker container and locally on your machine.
## Introduction to Cypress

Cypress is a powerful, open-source testing framework for web applications that enables developers to write tests with a simple, easy-to-understand syntax. It automatically handles the complexity of dealing with asynchronous code, making it easier to write and maintain reliable tests.

With Cypress, you can test your application by simulating real user interactions and verifying that your application behaves as expected under various conditions. You can learn more about Cypress on the [official website](https://www.cypress.io/) .
## Running Cypress in Docker

To run your Cypress tests in a Docker container, follow these steps: 
1. Run the Docker Compose command to start the test environment:

```bash
docker-compose up --profile tests
``` 
2. Create a `.docker.env` file in the root of your project, if it does not exist, and configure the necessary environment variables. The file must include at least the following variables:

```bash
# .frontend/.env.docker
VITE_BACKEND_DOMAIN=http://localhost:8000
VITE_CYPRESS_BACKEND_DOMAIN=http://backend:8000
```



## Setting Up Cypress Locally

To set up Cypress and run tests locally, follow these steps: 
1. Install the necessary dependencies by running the following command in ./frontend:

```bash 
yarn install
``` 
2. Navigate to the `frontend` folder and run the Cypress tests using the following command:

```bash
yarn run cypress run
``` 
3. Create a `.env.local` file in the `frontend` folder, if it does not exist, and configure the necessary environment variables. The file must include at least the following variables

```bash
# frontend/.env.local
VITE_BACKEND_DOMAIN=http://localhost:8000
VITE_CYPRESS_BACKEND_DOMAIN=http://localhost:8000
```

With these steps, you should now be able to successfully set up and run Cypress tests both in Docker and locally on your machine.


# Docker Compose Configuration for Cypress

The Docker Compose configuration sets up a Cypress service for running end-to-end tests in a multi-container environment. Below is a short explanation of each configuration option in the file.

```yaml
cypress:
  depends_on:
    - frontend
    - backend
  profiles:
    - tests
  build:
    context: ./frontend
    dockerfile: Dockerfile.cypress
  platform: linux/arm64/v8
  env_file:
    - ./frontend/.env.docker
  environment:
    - IS_DOCKER=YES
    - CYPRESS_baseUrl=http://frontend:3000
  volumes:
    - ./frontend/cypress:/frontend/cypress
  command: "yarn run cypress:run"
```

 
- `depends_on`: Specifies that the `cypress` service depends on the `frontend` and `backend` services. This ensures that the `frontend` and `backend` containers are up and running before the `cypress` service starts. 
- `profiles`: Assigns the `tests` profile to the `cypress` service. This allows you to selectively start the `cypress` service using the `--profile` option with `docker compose`. 
- `build`: Defines the build context and Dockerfile for the `cypress` service. The build context is set to the `./frontend` directory, and the Dockerfile is named `Dockerfile.cypress`. 
- `platform`: Specifies the target platform for the `cypress` service, which is set to `linux/arm64/v8` in this case. 
- `env_file`: Loads environment variables from the specified file `./frontend/.env.docker`. This file contains the environment settings needed for the `frontend` service. 
- `environment`: Defines additional environment variables for the `cypress` service. `IS_DOCKER=YES` is used to indicate that the service is running inside a Docker container, and `CYPRESS_baseUrl` is set to the URL of the `frontend` service. 
- `volumes`: Creates a volume mapping between the `./frontend/cypress` folder on the host machine and the `/frontend/cypress` folder inside the container. This allows the Cypress tests to be stored and accessed in the container. 
- `command`: Specifies the command to run when the `cypress` service starts, which is `yarn run cypress:run` in this case. This command will execute the Cypress tests within the container.
