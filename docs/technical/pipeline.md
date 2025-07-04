[**&larr; Back: Documentation Overview**](../../README.md#documentation-overview)

# Pipelines

Is your PR not passing the pipeline checks? Look no further.
Below you will find a collection of commands thats run by the pipeline and will allow you to check and fix issues locally.
At the bottom of each section is a link to a comprehensive collection of all commands, should you discover a missing command you find it there. (In that case please add the command to this doc)

## Frontend

_Install dependencies_

```
yarn
```

_Run Biome_

```
yarn biome:ci
```

_Run Biome fix_

```
yarn biome:fix
```

_Run Stylelint_

```
yarn stylelint:check
```

_Run typescript compiler check_

```
yarn tsc:check
```

Didnt find what you were looking for? See all frontend commands [here](../../frontend/package.json)

## Backend

```
poetry install
```

_Run Ruff_

```
poetry run ruff check
```

_Run Ruff fix_

```
poetry run ruff check --fix .
```

_Verify migrations_

```
poetry run python manage.py makemigrations --check --dry-run --noinput --verbosity 2
```

_Apply migrations_

```
poetry run python manage.py migrate
```

_Run (Py)tests_

```
poetry run pytest
```

_Run mypy_

```
poetry run mypy --config-file mypy.ini .
```

_Run seed_

```
poetry run python manage.py seed
```

Didnt find what you were looking for? See all backend commands [here](../../backend/aliases.sh)
