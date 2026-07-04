#!/bin/bash

##########################
#         README:        #
##########################
# This is a list of all commands commonly used in the project.
# It was made because uv doesn't support builtin alias like Pipfile and package.json. Seemed better than installing 3rd party alias tool.
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
[ "$SHELL" = "/bin/bash" ] && shopt -s expand_aliases


##########################
#          misc:         #
##########################
alias git-has-change='git diff --quiet' # <filepath>
alias la='ls -la'


##########################
#           uv:          #
##########################
alias uv-info='uv python find' # Find location of the active Python interpreter / environment.
alias uv-where='uv-info' # Find location of environment.
alias uv-sync='uv sync' # Install the exact dependencies from the lockfile (incl. dev group).
alias uv-i='uv-sync' # Shorter alias for 'uv-sync'.
alias uv-s='uv-sync' # Shorter alias for 'uv-sync'.
alias uv-lock='uv lock' # Update the lockfile according to the rules in pyproject.toml. The file 'uv.lock' may change. IMPORTANT: it doesn't install anything in venv, use 'uv-sync' for that.
alias uv-update='uv lock --upgrade' # Upgrade locked dependencies to the latest allowed versions. IMPORTANT: it doesn't install anything in venv, use 'uv-sync' for that.
alias uv-u='uv-update' # Alias for 'uv-update'.
alias uv-sync-prod='uv sync --frozen --no-dev' # Sync of dependencies in production (no dev group, fails on outdated lockfile).
alias uv-sync-pipeline='uv sync --frozen' # Sync of dependencies in pipeline. Fails if lockfile is out of sync with pyproject.toml.
alias uv-lock-check='uv lock --check' # Verify the lockfile is up-to-date with pyproject.toml without modifying it. Fails if outdated.
alias uv-graph='uv tree' # Show dependency graph.
alias uv-rm='rm -rf .venv' # Completely remove virtual environment.
alias uv-outdated='uv tree --outdated' # Show outdated dependencies.


##########################
#         uv run:        #
##########################
# Scripts piped through the uv-managed environment.
alias uv-run-ruff-check='uv run ruff check .' # Run ruff check linter on project.
alias uv-run-ruff-apply='uv run ruff check --fix .' # Apply ruff linter on project.
alias uv-run-ruff-format-check='uv run ruff format --check .' # Dry ruff format on all files in the project.
alias uv-run-ruff-format-apply='uv run ruff format .' # Apply ruff format on all files in the project.
alias uv-run-mypy-run='uv run mypy --config-file mypy.ini .' # Run mypy on project.

alias uv-run-migrations-make='uv run python manage.py makemigrations --noinput' # makemigrations
alias uv-run-migrations-verify='uv run python manage.py makemigrations --check --dry-run --noinput --verbosity 2' # Verify that migrations are up-to-date and valid.
alias uv-run-migrations-apply='uv run python manage.py migrate' # Apply migrations.
alias uv-run-collectstatic='uv run python manage.py collectstatic --noinput' # Collect static files from apps to root of project.

alias uv-run-pytest-run='uv run pytest' # Run pytest on project.
alias uv-run-pipeline='uv-run-mypy-run && uv-run-ruff-check && uv-run-ruff-format-check && uv-run-migrations-verify && uv-run-pytest-run' # Run all checks in pipeline.
alias uv-run-seed='uv run python manage.py seed' # Apply seed of database.
alias uv-run-regenerate-image-variants='uv run python manage.py generate_image_variants --force --workers 4' # Regenerate small/medium/large image variants
