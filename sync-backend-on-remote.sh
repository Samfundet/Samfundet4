#!/bin/bash
# Dette scriptet kjører med setuid samfundet-httpd i prod

set -euo pipefail

# Setter umask slik at nye filer får 664/775-tilganger
# (lim-web har skrivetilgang)
umask 002

git pull
cd backend
source venv/bin/activate
poetry install --sync --only main
python manage.py migrate
touch reload
