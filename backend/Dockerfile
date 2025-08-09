# Multi-stage build for better caching and smaller final image
FROM python:3.11.2-slim-bullseye AS dependencies

##################################
#     Environment variables      #
##################################
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1
ENV POETRY_VIRTUALENVS_IN_PROJECT=1

##################################
#      System dependencies       #
##################################
# gcc, libpq-dev, python3-dev: psycopg-dependencies.
RUN set -eux && \
    apt-get update && \
    apt-get install -y --no-install-recommends gcc libpq-dev python3-dev && \
    python -m pip install poetry && \
    rm -rf /var/lib/apt/lists/* && \
    export PATH=/usr/lib/postgresql/X.Y/bin/:$PATH

# Set up working directory and install dependencies
WORKDIR /app
COPY pyproject.toml poetry.lock* ./
RUN mkdir .venv && poetry install --sync

# Production stage
FROM python:3.11.2-slim-bullseye AS production

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
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1
ENV POETRY_VIRTUALENVS_IN_PROJECT=1

##################################
#      Runtime dependencies      #
##################################
# Install only runtime dependencies (no build tools)
RUN set -eux && \
    apt-get update && \
    apt-get install -y --no-install-recommends libpq5 && \
    python -m pip install poetry && \
    rm -rf /var/lib/apt/lists/*

##################################
#             Aliases            #
################################## 
RUN echo 'alias la="ls -la"' >> ~/.bashrc && \
    echo 'alias migrate="poetry run python /app/manage.py migrate"' >> ~/.bashrc && \
    echo 'alias makemigrations="poetry run python /app/manage.py makemigrations"' >> ~/.bashrc && \
    echo 'alias seed="poetry run python /app/manage.py seed"' >> ~/.bashrc && \
    echo 'alias collectstatic="poetry run python /app/manage.py collectstatic --noinput"' >> ~/.bashrc && \
    echo 'alias pipeline="poetry run /app/run-pipeline.sh"' >> ~/.bashrc && \
    echo 'source aliases.sh' >> ~/.bashrc

# Create app directory
WORKDIR /app

# Copy virtual environment from dependencies stage
COPY --from=dependencies /app/.venv /app/.venv

# Copy dependency files
COPY pyproject.toml poetry.lock* ./

# Copy application code (this layer will be invalidated on code changes)
COPY . /app

# Start.
ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["poetry", "run", "python", "manage.py", "runserver", "0.0.0.0:8000"]
