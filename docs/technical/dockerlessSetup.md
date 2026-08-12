# How to run the project without Docker

I no understand Windows, so this guide is for Linux and MacOS users. It might work on Windows, but I can't guarantee it.

# Backend setup

## Step 1

Install [uv](https://docs.astral.sh/uv/), the Python package and project manager. It manages the
Python version, the virtual environment and the dependencies (replacing pyenv, pip, poetry and
virtualenv).

```bash
# macOS (Homebrew):
brew install uv

# Linux/macOS (standalone installer):
curl -LsSf https://astral.sh/uv/install.sh | sh
```

## Step 2

uv reads the correct Python version from the `backend/.python-version` file and downloads it automatically. From inside
the `backend` directory, install the locked dependencies:

```bash
uv sync
```

To verify that the installation was successful, check that a non-empty `.venv` directory was created
in the backend directory. You can also run `uv run python -V` and confirm it prints the expected
Python version.

> Note: `.env` files are loaded by the project's settings (django-environ); no extra plugin is
> needed.

## Step 3

Run the development server:

```bash
uv run python manage.py runserver
```
