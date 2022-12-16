#! /bin/bash

# Shorthand for running all verification steps in backend pipeline.
# Requires an already existing fully configured pipenv, project and database.
# NOTE: this must be kept in sync with .github/workflows/verify.yml.
# Run example: $ pipenv run ./run-pipeline.sh


function exit_if_failed {
	# Premature exit if code is not ok.

	code=$1
	# shellcheck disable=SC1090
	[[ "$code" != 0 ]] && exit "$code"
}

echo;echo;echo "Check yapf."
yapf --parallel --recursive --diff .
exit_if_failed $?

echo;echo;echo "Verify migrations."
python manage.py makemigrations --check --dry-run
python manage.py migrate
exit_if_failed $?

echo;echo;echo "Run tests."
pytest
exit_if_failed $?

echo;echo;echo "Run bandit."
bandit --recursive --ini .bandit .
exit_if_failed $?

echo;echo;echo "Run mypy."
mypy --config-file mypy.ini .
exit_if_failed $?

echo;echo;echo "Run flake8."
flake8 --config=.flake8 .
exit_if_failed $?

echo;echo;echo "Run pylint."
./run-pylint.sh
exit_if_failed $?
