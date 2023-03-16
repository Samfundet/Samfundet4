#!/bin/sh

pipenv run python manage.py collectstatic --noinput
pipenv run python manage.py makemigrations
pipenv run python manage.py migrate

# Then exec the container's main process (what's set as CMD in the Dockerfile).
exec "$@"
