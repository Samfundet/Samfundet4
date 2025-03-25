#! /bin/bash

# Shorthand for running all verification steps in backend pipeline.
# Requires an already existing fully configured poetry environment, project and database.
# NOTE: this must be kept in sync with .github/workflows/verify.yml.
# Run example: $ poetry run ./run-pipeline.sh

set -e

echo;echo;echo "Check ruff."
ruff format --check .

echo;echo;echo "Verify migrations."
python manage.py makemigrations --check --dry-run
python manage.py migrate

echo;echo;echo "Run tests."
pytest

echo;echo;echo "Run mypy."
mypy --config-file mypy.ini .
