# How to run the project without Docker

I no understand Windows, so this guide is for Linux and MacOS users. It might work on Windows, but I can't guarantee it.

# Backend setup

## Step 1
First make sure you have the correct python version installed. Check the `.python-version` file in the root of the project. At the time of writing the correct version is '3.11.2'.

<!-- expandable section  -->
<details>
<summary>How to install correct python version with pyenv </summary>

Note: Pyenv does not exist on windows, so you will have to install the correct python version manually.

Install pyenv
```bash
brew install pyenv
```

Install the correct python version
```bash
pyenv install 3.11.2
```

Set the correct python version
```bash
pyenv global 3.11.2
```


</details>


## Step 2

From inside the backend directory, run the following commands:

```bash
pip install poetry
export POETRY_VIRTUALENVS_IN_PROJECT=1
```

## Step 3

Install the dependencies with poetry:

```bash
poetry install
```

To verify that the installation was successful, run the following command, check if there is a non empty .venv file in the backend directory.

## Step 4

Install dotenv for poetry
    
```bash
❯ poetry self add poetry-plugin-dotenv
```

## Step 5

Install 

```bash
poetry run python manage.py runserver
```
