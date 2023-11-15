# Use same version as defined in .python-version.
FROM python:3.11.0-slim-bullseye

EXPOSE 8000
EXPOSE 5678

# Docker should configure env vars in '.docker.env'.
ENV PIPENV_DONT_LOAD_ENV=1
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1
ENV PIPENV_VENV_IN_PROJECT=1

# Dependency for billig development database
RUN apt-get update
RUN apt-get install sqlite3

# Alias
RUN echo 'alias la="ls -la"' >> ~/.bashrc

# Useful alias shortcuts for django
RUN echo 'alias migrate="pipenv run python /app/manage.py migrate"' >> ~/.bashrc
RUN echo 'alias makemigrations="pipenv run python /app/manage.py makemigrations"' >> ~/.bashrc
RUN echo 'alias seed="pipenv run python /app/manage.py seed"' >> ~/.bashrc
RUN echo 'alias collectstatic="pipenv run python /app/manage.py collectstatic --noinput"' >> ~/.bashrc
RUN echo 'alias pipeline="pipenv run /app/run-pipeline.sh"' >> ~/.bashrc

# Make directories
RUN mkdir /app
WORKDIR /app

# Prepare virtual environment.
RUN mkdir .venv
RUN python -m pip install pipenv

# Install dependecies
COPY Pipfile Pipfile.lock ./
RUN python -m pipenv install --dev --deploy

# Copy remaining
COPY . /app

# Start
ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["pipenv", "run", "python", "manage.py", "runserver", "0.0.0.0:8000"]
