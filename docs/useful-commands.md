[**&larr; Back: Documentation Overview**](../README.md#documentation-overview)

# Useful commands

- [🐍 Python](#-python)
  - [🐍 uv: Install uv](#-uv-install-uv)
  - [🐍 uv: Install Python](#-uv-install-python)
  - [🐍 uv: Install virtual environment with dependencies](#-uv-install-virtual-environment-with-dependencies)
  - [🐍 uv: Install package](#-uv-install-package)
  - [🐍 uv: Uninstall package](#-uv-uninstall-package)
  - [🐍 uv: Run command inside virtual environment](#-uv-run-command-inside-virtual-environment)
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
  - [🧶 Yarn: Open Cypress GUI](#-yarn-open-cypress-gui)
  - [🧶 Yarn: Run Cypress (no GUI)](#-yarn-run-cypress-no-gui)

<br>
<hr>
<br>

## 🐍 Python

<br>

### 🐍 uv: Install uv
> macOS (Homebrew):
```bash
brew install uv
```
> Linux/macOS (standalone installer):
```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

<br>
<br>

### 🐍 uv: Install Python
> uv reads the pinned version from [.python-version](/backend/.python-version).
> Must run inside the `backend` directory.
```bash
uv python install
```

<br>
<br>

### 🐍 uv: Install virtual environment with dependencies
> Must run inside same directory as [pyproject.toml](/backend/pyproject.toml).
> Creates `.venv` (downloading the pinned Python if needed) and installs the locked dependencies.
```bash
uv sync
```

<br>
<br>

### 🐍 uv: Install package
> Adds the package to `pyproject.toml` and updates `uv.lock`.
```bash
uv add <package>
```

<br>
<br>

### 🐍 uv: Uninstall package
```bash
uv remove <package>
```

<br>
<br>

### 🐍 uv: Run command inside virtual environment
```bash
uv run <command>
```
```bash
# Example:
uv run python -V
```

<br>
<br>

### 🐍 Django: Show all commands
```bash
uv run python manage.py
```

<br>
<br>

### 🐍 Django: Run command
```bash
# Locally:
uv run python manage.py <command>
```
```bash
# Inside container:
docker compose exec backend uv run python manage.py <command>
```

<br>
<br>

### 🐍 Django: Makemigrations
```bash
# Locally: 
uv run python manage.py makemigrations
```

<br>
<br>

### 🐍 Django: Migrate
```bash
# Locally: 
uv run python manage.py migrate
```

<br>
<br>

### 🐍 Django: Start server
```bash
uv run python manage.py runserver
```

<br>
<br>

### 🐍 Django: Show all urls
```bash
uv run python manage.py show_urls -f table
```

<br>
<br>

### 🐍 Django: Collect all staticfiles
```bash
uv run python manage.py collectstatic
```

<br>
<br>

### 🐍 Django: Open shell
```bash
uv run python manage.py shell_plus
```

<br>
<br>

### 🐍 Django: Collect all staticfiles
```bash
uv run python manage.py collectstatic
```

<br>
<hr>
<br>

## 🐳 Docker

<br>

Be sure to check out the documentation for [Docker command aliases](./docker-project-specific-commands.md).

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
> Must run in same directory as [package.json](/frontend/package.json).

<br>

### 🧶 Npm: Install yarn
```bash
npm install --global yarn
```

<br>
<br>

### 🧶 Yarn: Install dependencies
```bash
yarn install
```

<br>
<br>

### 🧶 Yarn: Install package
```bash
yarn add <package>
```

<br>
<br>

### 🧶 Yarn: Uninstall package
```bash
yarn remove <package>
```

<br>
<br>

### 🧶 Yarn: Start server
```bash
yarn start
```

<br>
<br>

### 🧶 Yarn: Start Storybook
```bash
yarn storybook
```

<br>
<br>

### 🧶 Yarn: Open Cypress GUI
```bash
yarn cypress open
```

<br>
<br>

### 🧶 Yarn: Run Cypress (no GUI)
```bash
yarn cypress run
```
