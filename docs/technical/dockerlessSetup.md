# How to run the project without Docker

# Backend setup

## Step 1
First make sure you have the correct python version installed. Check the `.python-version` file in the root of the project. At the time of writing the correct version is '3.11.2'.

## Step 2

From inside the backend directory, run the following commands:

```bash
pip install poetry
export POETRY_VIRTUALENVS_IN_PROJECT=1
```

## Step 3

Install the dependencies with poetry:

```bash
poetry install
```

To verify that the installation was successful, run the following command, check if there is a non empty .venv file in the backend directory.

## Step 4

Install dotenv for poetry
    
```bash
❯ poetry self add poetry-plugin-dotenv
```

## Step 5

Install 

```bash
poetry run python manage.py runserver
```
