#!/bin/sh

poetry run python manage.py collectstatic --noinput
poetry run python manage.py makemigrations
poetry run python manage.py migrate
poetry run python manage.py seed_if_db_empty

# Then exec the container's main process (what's set as CMD in the Dockerfile).
exec "$@"
