[👈 back](/docs/README.md)

# Useful commands

- [🐍 Python](#-python)
  - [🐍 Pyenv: Install python](#-pyenv-install-python)
  - [🐍 Python: Call submodule of Python](#-python-call-submodule-of-python)
  - [🐍 Python: Install pipenv](#-python-install-pipenv)
  - [🐍 Pipenv: Install virtual environment with dependencies](#-pipenv-install-virtual-environment-with-dependencies)
  - [🐍 Pipenv: Install package](#-pipenv-install-package)
  - [🐍 Pipenv: Uninstall package](#-pipenv-uninstall-package)
  - [🐍 Pipenv: Activate virtual environment](#-pipenv-activate-virtual-environment)
  - [🐍 Pipenv: Run command inside virtual environment](#-pipenv-run-command-inside-virtual-environment)
  - [🐍 Django: Show all commands](#-django-show-all-commands)
  - [🐍 Django: Run command](#-django-run-command)
  - [🐍 Django: Makemigrations](#-django-makemigrations)
  - [🐍 Django: Migrate](#-django-migrate)
  - [🐍 Django: Start server](#-django-start-server)
  - [🐍 Django: Show all urls](#-django-show-all-urls)
  - [🐍 Django: Collect all staticfiles](#-django-collect-all-staticfiles)
  - [🐍 Django: Open shell](#-django-open-shell)
  - [🐍 Django: Collect all staticfiles](#-django-collect-all-staticfiles-1)
- [🐳 Docker](#-docker)
  - [🐳 Docker: Run command inside container](#-docker-run-command-inside-container)
  - [🐳 Docker: Remove containers](#-docker-remove-containers)
  - [🐳 Docker: Open shell in container](#-docker-open-shell-in-container)
  - [🐳 Docker: Run command inside already running container](#-docker-run-command-inside-already-running-container)
  - [🐳 Docker: Run a one-off container with command](#-docker-run-a-one-off-container-with-command)
  - [🐳 Docker: Build project](#-docker-build-project)
  - [🐳 Docker: Start all containers](#-docker-start-all-containers)
  - [🐳 Docker: Start individual container](#-docker-start-individual-container)
- [🧶 Yarn](#-yarn)
  - [🧶 Npm: Install yarn](#-npm-install-yarn)
  - [🧶 Yarn: Install dependencies](#-yarn-install-dependencies)
  - [🧶 Yarn: Install package](#-yarn-install-package)
  - [🧶 Yarn: Uninstall package](#-yarn-uninstall-package)
  - [🧶 Yarn: Start server](#-yarn-start-server)
  - [🧶 Yarn: Start Storybook](#-yarn-start-storybook)

<br>
<hr>
<br>

## 🐍 Python

<br>

### 🐍 Pyenv: Install python
> `pyenv` must be installed.  
> Must run inside same directory as [.python-version](/backend/.python-version).
```bash
pyenv install
```

<br>
<br>

### 🐍 Python: Call submodule of Python
```bash
python -m <module>
```
```bash
# Example:
python -m pipenv
```

<br>
<br>

### 🐍 Python: Install pipenv
```bash
python -m pip install pipenv
```

<br>
<br>

### 🐍 Pipenv: Install virtual environment with dependencies
> Must run inside same directory as [Pipfile](/backend/Pipfile).
```bash
PIPENV_VENV_IN_PROJECT=1 python -m pipenv install
```

<br>
<br>

### 🐍 Pipenv: Install package
```bash
python -m pipenv install <package>
```

<br>
<br>

### 🐍 Pipenv: Uninstall package
```bash
python -m pipenv uninstall <package>
```

<br>
<br>

### 🐍 Pipenv: Activate virtual environment
```bash
python -m pipenv shell
```

<br>
<br>

### 🐍 Pipenv: Run command inside virtual environment
```bash
python -m pipenv run <command>
```
```bash
# Example:
python -m pipenv run python -V
```

<br>
<br>

### 🐍 Django: Show all commands
```bash
python -m pipenv run python manage.py
```

<br>
<br>

### 🐍 Django: Run command
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

### 🐍 Django: Makemigrations
```bash
# Locally: 
python -m pipenv run python manage.py makemigrations
```

<br>
<br>

### 🐍 Django: Migrate
```bash
# Locally: 
python -m pipenv run python manage.py makemigrations
```

<br>
<br>

### 🐍 Django: Start server
```bash
python -m pipenv run python manage.py runserver
```

<br>
<br>

### 🐍 Django: Show all urls
```bash
python -m pipenv run python manage.py show_urls -f table
```

<br>
<br>

### 🐍 Django: Collect all staticfiles
```bash
python -m pipenv run python manage.py collectstatic
```

<br>
<br>

### 🐍 Django: Open shell
```bash
python -m pipenv run python manage.py shell_plus
```

<br>
<br>

### 🐍 Django: Collect all staticfiles
```bash
python -m pipenv run python manage.py collectstatic
```

<br>
<hr>
<br>

## 🐳 Docker

<br>

### 🐳 Docker: Run command inside container
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

### 🐳 Docker: Remove containers
> `<container-name>` is defined under `services` in [docker-compose.yml](/docker-compose.yml).
```bash
docker compose down
```

<br>
<br>

### 🐳 Docker: Open shell in container
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


### 🐳 Docker: Run command inside already running container
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


### 🐳 Docker: Run a one-off container with command
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

### 🐳 Docker: Build project
```bash
docker compose build
```

<br>
<br>

### 🐳 Docker: Start all containers
```bash
docker compose up
```

<br>
<br>

### 🐳 Docker: Start individual container
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

## 🧶 Yarn

<br>

### 🧶 Npm: Install yarn
> Must run in same directory as [package.json](/frontend/package.json).
```bash
npm install --global yarn
```

### 🧶 Yarn: Install dependencies
> Must run in same directory as [package.json](/frontend/package.json).
```bash
yarn install
```

### 🧶 Yarn: Install package
> Must run in same directory as [package.json](/frontend/package.json).
```bash
yarn add <package>
```

### 🧶 Yarn: Uninstall package
> Must run in same directory as [package.json](/frontend/package.json).
```bash
yarn remove <package>
```

### 🧶 Yarn: Start server
> Must run in same directory as [package.json](/frontend/package.json).
```bash
yarn start
```


### 🧶 Yarn: Start Storybook
> Must run in same directory as [package.json](/frontend/package.json).
```bash
yarn storybook
```
