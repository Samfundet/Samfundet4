[๐ back](/docs/README.md)

# Useful commands

- [๐ Python](#-python)
  - [๐ Pyenv: Install python](#-pyenv-install-python)
  - [๐ Python: Call submodule of Python](#-python-call-submodule-of-python)
  - [๐ Python: Install pipenv](#-python-install-pipenv)
  - [๐ Pipenv: Install virtual environment with dependencies](#-pipenv-install-virtual-environment-with-dependencies)
  - [๐ Pipenv: Install package](#-pipenv-install-package)
  - [๐ Pipenv: Uninstall package](#-pipenv-uninstall-package)
  - [๐ Pipenv: Activate virtual environment](#-pipenv-activate-virtual-environment)
  - [๐ Pipenv: Run command inside virtual environment](#-pipenv-run-command-inside-virtual-environment)
  - [๐ Django: Show all commands](#-django-show-all-commands)
  - [๐ Django: Run command](#-django-run-command)
  - [๐ Django: Makemigrations](#-django-makemigrations)
  - [๐ Django: Migrate](#-django-migrate)
  - [๐ Django: Start server](#-django-start-server)
  - [๐ Django: Show all urls](#-django-show-all-urls)
  - [๐ Django: Collect all staticfiles](#-django-collect-all-staticfiles)
  - [๐ Django: Open shell](#-django-open-shell)
  - [๐ Django: Collect all staticfiles](#-django-collect-all-staticfiles-1)
- [๐ณ Docker](#-docker)
  - [๐ณ Docker: Run command inside container](#-docker-run-command-inside-container)
  - [๐ณ Docker: Remove containers](#-docker-remove-containers)
  - [๐ณ Docker: Open shell in container](#-docker-open-shell-in-container)
  - [๐ณ Docker: Run command inside already running container](#-docker-run-command-inside-already-running-container)
  - [๐ณ Docker: Run a one-off container with command](#-docker-run-a-one-off-container-with-command)
  - [๐ณ Docker: Build project](#-docker-build-project)
  - [๐ณ Docker: Start all containers](#-docker-start-all-containers)
  - [๐ณ Docker: Start individual container](#-docker-start-individual-container)
- [๐งถ Yarn](#-yarn)
  - [๐งถ Npm: Install yarn](#-npm-install-yarn)
  - [๐งถ Yarn: Install dependencies](#-yarn-install-dependencies)
  - [๐งถ Yarn: Install package](#-yarn-install-package)
  - [๐งถ Yarn: Uninstall package](#-yarn-uninstall-package)
  - [๐งถ Yarn: Start server](#-yarn-start-server)
  - [๐งถ Yarn: Start Storybook](#-yarn-start-storybook)
  - [๐งถ Yarn: Open Cypress GUI](#-yarn-open-cypress-gui)
  - [๐งถ Yarn: Run Cypress (no GUI)](#-yarn-run-cypress-no-gui)

<br>
<hr>
<br>

## ๐ Python

<br>

### ๐ Pyenv: Install python
> `pyenv` must be installed.  
> Must run inside same directory as [.python-version](/backend/.python-version).
```bash
pyenv install
```

<br>
<br>

### ๐ Python: Call submodule of Python
```bash
python -m <module>
```
```bash
# Example:
python -m pipenv
```

<br>
<br>

### ๐ Python: Install pipenv
```bash
python -m pip install pipenv
```

<br>
<br>

### ๐ Pipenv: Install virtual environment with dependencies
> Must run inside same directory as [Pipfile](/backend/Pipfile).
```bash
PIPENV_VENV_IN_PROJECT=1 python -m pipenv install
```

<br>
<br>

### ๐ Pipenv: Install package
```bash
python -m pipenv install <package>
```

<br>
<br>

### ๐ Pipenv: Uninstall package
```bash
python -m pipenv uninstall <package>
```

<br>
<br>

### ๐ Pipenv: Activate virtual environment
```bash
python -m pipenv shell
```

<br>
<br>

### ๐ Pipenv: Run command inside virtual environment
```bash
python -m pipenv run <command>
```
```bash
# Example:
python -m pipenv run python -V
```

<br>
<br>

### ๐ Django: Show all commands
```bash
python -m pipenv run python manage.py
```

<br>
<br>

### ๐ Django: Run command
```bash
# Locally:
python -m pipenv run python manage.py <command>
```
```bash
# Inside container:
docker compose exec backend python -m pipenv run python manage.py <command>
```

<br>
<br>

### ๐ Django: Makemigrations
```bash
# Locally: 
python -m pipenv run python manage.py makemigrations
```

<br>
<br>

### ๐ Django: Migrate
```bash
# Locally: 
python -m pipenv run python manage.py makemigrations
```

<br>
<br>

### ๐ Django: Start server
```bash
python -m pipenv run python manage.py runserver
```

<br>
<br>

### ๐ Django: Show all urls
```bash
python -m pipenv run python manage.py show_urls -f table
```

<br>
<br>

### ๐ Django: Collect all staticfiles
```bash
python -m pipenv run python manage.py collectstatic
```

<br>
<br>

### ๐ Django: Open shell
```bash
python -m pipenv run python manage.py shell_plus
```

<br>
<br>

### ๐ Django: Collect all staticfiles
```bash
python -m pipenv run python manage.py collectstatic
```

<br>
<hr>
<br>

## ๐ณ Docker

<br>

### ๐ณ Docker: Run command inside container
> `<container-name>` is defined under `services` in [docker-compose.yml](/docker-compose.yml).
```bash
docker compose exec <container-name> <command>
```
```bash
# Example:
docker compose exec backend echo "Hello World!"
```

<br>
<br>

### ๐ณ Docker: Remove containers
> `<container-name>` is defined under `services` in [docker-compose.yml](/docker-compose.yml).
```bash
docker compose down
```

<br>
<br>

### ๐ณ Docker: Open shell in container
> `<container-name>` is defined under `services` in [docker-compose.yml](/docker-compose.yml).
```bash
docker compose exec <container-name> <command>
```
```bash
# Example:
docker compose exec backend bash
```

<br>
<br>


### ๐ณ Docker: Run command inside already running container
> `<container-name>` is defined under `services` in [docker-compose.yml](/docker-compose.yml).
```bash
docker compose exec <container-name> <command>
```
```bash
# Example:
docker compose exec backend echo "Hello World!"
```

<br>
<br>


### ๐ณ Docker: Run a one-off container with command
> `--rm` removes container after exiting.  
> `<container-name>` is defined under `services` in [docker-compose.yml](/docker-compose.yml).
```bash
docker compose run --rm <container-name> <command>
```
```bash
# Example:
docker compose run --rm backend echo "Hello World!"
```

<br>
<br>

### ๐ณ Docker: Build project
```bash
docker compose build
```

<br>
<br>

### ๐ณ Docker: Start all containers
```bash
docker compose up
```

<br>
<br>

### ๐ณ Docker: Start individual container
> `<container-name>` is defined under `services` in [docker-compose.yml](/docker-compose.yml).
```bash
docker compose up <container-name>
```
```bash
# Example:
docker compose up backend
```

<br>
<hr>
<br>

## ๐งถ Yarn
> Must run in same directory as [package.json](/frontend/package.json).

<br>

### ๐งถ Npm: Install yarn
```bash
npm install --global yarn
```

<br>
<br>

### ๐งถ Yarn: Install dependencies
```bash
yarn install
```

<br>
<br>

### ๐งถ Yarn: Install package
```bash
yarn add <package>
```

<br>
<br>

### ๐งถ Yarn: Uninstall package
```bash
yarn remove <package>
```

<br>
<br>

### ๐งถ Yarn: Start server
```bash
yarn start
```

<br>
<br>

### ๐งถ Yarn: Start Storybook
```bash
yarn storybook
```

<br>
<br>

### ๐งถ Yarn: Open Cypress GUI
```bash
yarn cypress open
```

<br>
<br>

### ๐งถ Yarn: Run Cypress (no GUI)
```bash
yarn cypress run
```
