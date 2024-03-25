#!/bin/sh

pipenv run python manage.py collectstatic --noinput
pipenv run python manage.py makemigrations
pipenv run python manage.py migrate
pipenv run python manage.py seed_if_db_empty

# Then exec the container's main process (what's set as CMD in the Dockerfile).
exec "$@"
