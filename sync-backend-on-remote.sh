#!/bin/bash
# Dette scriptet kjører med setuid samfundet-httpd i prod

set -euo pipefail

# Setter umask slik at nye filer får 664/775-tilganger
# (lim-web har skrivetilgang)
umask 002

git pull
cd backend
uv sync --frozen --no-dev
uv run python manage.py migrate
uv run python manage.py collectstatic --noinput
touch reload
