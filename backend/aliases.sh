#!/bin/bash

##########################
#         README:        #
##########################
# This is a list of all commands commonly used in the project.
# It was made because poetry doesn't support builtin alias like Pipfile and package.json. Seemed better than installing 3rd party alias tool.
# Preferably this list should be used in all scenarios, but not all environments are alias fiendly (e.g. Dockerfile and non-interactive-shell).
# If you find yourself running a command repeatedly, consider adding it here to share with other developers.


# Pros:
# + Overview of possible commands.
# + Easier to search and find commands used in the project.
# + Autocomplete in terminal, shorter, and easier to use.
# + Ensure developers actually use the same commands.
# + Compatible with "all" tools and package managers.

# Cons:
# - Without more setup, must be sourced manually.
# - Slight risk of overriding personal aliases.

# Run this to apply aliases:
# source aliases.sh


##########################
#        _setup:         #
##########################
# Enable aliases in CI/CD environments, only available in bash. https://github.com/actions/toolkit/issues/766#issuecomment-928305811
shopt -s expand_aliases


##########################
#          misc:         #
##########################
alias git-has-change='git diff --quiet' # <filepath>
alias la='ls -la'
alias pip-upgrade='python -m pip install --upgrade pip'
alias pip-install-poetry='python -m pip install poetry'


##########################
#         poetry:        #
##########################
alias poetry-info='poetry env info'
alias poetry-where='poetry-info' # Find location of environment.
alias poetry-sync='poetry install --sync' # Install the exact dependencies from lockfile.
alias poetry-i='poetry-sync' # Shorter alias for 'poetry-sync'.
alias poetry-s='poetry-sync' # Shorter alias for 'poetry-sync'.
alias poetry-lock='poetry lock --no-update' # Locks current dependencies according to the rules in pyproject.toml. Use to make sure current state is valid. This will not update to latest minors etc. IMPORTANT: it doesn't install anything in venv, use 'poetry-sync' for that.
alias poetry-update='poetry lock' # Updates lock on dependencies according to the rules in pyproject.toml. The file 'poetry.lock' will likely change. IMPORTANT: it doesn't install anything in venv, use 'poetry-sync' for that.
alias poetry-u='poetry-update' # Alias for 'poetry-update'.
alias poetry-sync-prod='poetry install --sync --only main' # Sync of dependencies in production.
alias poetry-sync-pipeline='poetry-lock-check && poetry-sync' # Sync of dependencies in pipeline. Fails if outdated lockfile.
alias poetry-lock-check='(poetry check --lock > /dev/null && poetry-lock > /dev/null; git-has-change poetry.lock) || (echo "Outdated poetry.lock"; exit 1) ' # Utilises builtin (insufficient) check, then performs an actual lock to check diff. This should not result in a changed file.
alias poetry-graph="poetry show --tree" # Show dependency graph.
alias poetry-rm="poetry env remove --all" # Completely remove virtual environment.
alias poetry-shell="poetry shell" # Opens a shell within the virtual environment.
alias poetry-outdated="poetry show --outdated" # Show outdated dependencies.


##########################
#       poetry run:      #
##########################
# Scripts piped through poetry environment.
alias poetry-run-ruff-check='poetry run ruff check .' # Run ruff check linter on project.
alias poetry-run-ruff-apply='poetry run ruff check --fix .' # Apply ruff linter on project.
alias poetry-run-ruff-format-check='poetry run ruff format --check .' # Dry ruff format on all files in the project.
alias poetry-run-ruff-format-apply='poetry run ruff format .' # Apply ruff format on all files in the project.
alias poetry-run-mypy-run='poetry run mypy --config-file mypy.ini .' # Run mypy on project.

alias poetry-run-migrations-make='poetry run python manage.py makemigrations --noinput' # makemigrations
alias poetry-run-migrations-verify='poetry run python manage.py makemigrations --check --dry-run --noinput --verbosity 2' # Verify that migrations are up-to-date and valid.
alias poetry-run-migrations-apply='poetry run python manage.py migrate' # Apply migrations.
alias poetry-run-collectstatic='poetry run python manage.py collectstatic --noinput' # Collect static files from apps to root of project.

alias poetry-run-pytest-run='poetry run pytest' # Run pytest on project.
alias poetry-run-pipeline='poetry-run-mypy-run && poetry-run-ruff-check && poetry-run-ruff-format-check && poetry-run-migrations-verify && poetry-run-pytest-run' # Run all checks in pipeline.
alias poetry-run-seed='poetry run python manage.py seed' # Apply seed of database.
