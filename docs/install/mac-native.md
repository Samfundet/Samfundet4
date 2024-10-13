[**&larr; Back: Getting started**](../introduction.md)

# Installing on MacOS (Native)

## Requirements

* [Homebrew](https://docs.brew.sh/Installation)
* [Poetry](https://python-poetry.org/docs/)
* [yarn](https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable)

## Installing

First clone the Samfundet4 repository.

```bash
git clone git@github.com:Samfundet/Samfundet4.git
```

Install the frontend dependencies

```bash
cd Samfundet4/frontend
yarn
```

Install the backend dependencies

```bash
cd ../backend
poetry install
```

Then apply migrations and run seed script (the seed script adds test data to our database)

```bash
poetry run python3 manage.py migrate
poetry run python3 manage.py seed
```

## Environment files

Both the `backend` and `frontend` directories have an `.env.example` file. In each directory, copy this file to `.env`
and adjust any values as needed. You may for example want to change the default Django superuser username and
password (`DJANGO_SUPERUSER_USERNAME` and `DJANGO_SUPERUSER_USERNAME`).

## Running

Start backend:

```bash
cd backend
poetry run python3 manage.py runserver
```

Start frontend:

```bash
cd frontend
yarn start
```
