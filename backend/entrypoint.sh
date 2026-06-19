#!/bin/sh

uv run python manage.py collectstatic --noinput
uv run python manage.py makemigrations
uv run python manage.py migrate
uv run python manage.py seed_if_db_empty

# Then exec the container's main process (what's set as CMD in the Dockerfile).
exec "$@"
