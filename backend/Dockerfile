# Use same version as defined in .python-version.
FROM python:3.11.2-slim-bullseye

##################################
#         Exposed ports          #
##################################

# Backend server.
EXPOSE 8000
# Debugpy session.
EXPOSE 5678

##################################
#     Environment variables      #
##################################
# Docker-compose should configure env vars in '.docker.env'.
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1
ENV POETRY_VIRTUALENVS_IN_PROJECT=1

##################################
#      System dependencies       #
##################################
# sqlite3: dependency for billig development database.
# gcc, libpq-dev: psycopg-dependencies.
RUN apt-get update
RUN apt-get install sqlite3 gcc libpq-dev -y
RUN export PATH=/usr/lib/postgresql/X.Y/bin/:$PATH


##################################
#             Alias              #
################################## 
RUN echo 'alias la="ls -la"' >> ~/.bashrc
# Useful alias shortcuts for django.
RUN echo 'alias migrate="poetry run python /app/manage.py migrate"' >> ~/.bashrc
RUN echo 'alias makemigrations="poetry run python /app/manage.py makemigrations"' >> ~/.bashrc
RUN echo 'alias seed="poetry run python /app/manage.py seed"' >> ~/.bashrc
RUN echo 'alias collectstatic="poetry run python /app/manage.py collectstatic --noinput"' >> ~/.bashrc
RUN echo 'alias pipeline="poetry run /app/run-pipeline.sh"' >> ~/.bashrc


# Make directories.
RUN mkdir /app
WORKDIR /app

# Prepare virtual environment.
RUN mkdir .venv
RUN python -m pip install poetry

# Install venv dependecies.
COPY pyproject.toml poetry.lock* ./
RUN python -m poetry install

# Copy remaining.
COPY . /app

# Start.
ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["poetry", "run", "python", "manage.py", "runserver", "0.0.0.0:8000"]
