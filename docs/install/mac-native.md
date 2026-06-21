[**&larr; Back: Getting started**](../introduction.md)

# Installing on MacOS (Native)

## Requirements

* [Homebrew](https://docs.brew.sh/Installation)
    * MacOS package manager
* [uv](https://docs.astral.sh/uv/)
    * Backend Python package, project and version manager (replaces pip, poetry, pyenv and virtualenv).
      It also installs the Python version that Samfundet4 expects (defined in `backend/.python-version`).
* [yarn](https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable)
    * Frontend dependency manager

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
uv sync
```

Then apply migrations and run seed script (the seed script adds test data to our database)

```bash
uv run python3 manage.py migrate
uv run python3 manage.py seed
```

## Environment files

Both the `backend` and `frontend` directories have an `.env.example` file. In each directory, copy this file to `.env`
and adjust any values as needed. You may for example want to change the default Django superuser username and
password (`DJANGO_SUPERUSER_USERNAME` and `DJANGO_SUPERUSER_PASSWORD`).

## Running

Start backend:

```bash
cd backend
uv run python3 manage.py runserver
```

Start frontend:

```bash
cd frontend
yarn start
```

## Post-install

Now that you've got the project up and running, check out the post-install instructions:

<h3 align="right">
<a href="/docs/install/post-install.md">&rarr; Next: Post-install</a>
</h3>
