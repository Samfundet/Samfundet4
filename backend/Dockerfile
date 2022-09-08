# Use same version as defined in .python-version.
FROM python:3.10.5-slim-buster

# Update Ubuntu Software repository.
RUN apt update -y \
    && apt upgrade -y \
    && apt install -y --no-install-recommends git build-essential procps curl file git nano sudo ncdu gcc postgresql libpq-dev \
    && rm -rf /var/lib/apt/lists/*

### Environment variables. ###
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PIPENV_VENV_IN_PROJECT=1
# Docker should configure env vars in '.docker.env'.
ENV PIPENV_DONT_LOAD_ENV=1

# Set working directory.
WORKDIR /app

# Upgrade pip.
RUN python -m pip install --upgrade pip

# Install pipenv.
RUN python -m pip install pipenv

# Copy dependency files into workdir (optimise docker cache layers).
COPY Pipfile Pipfile.lock ./

# Install virtual environment.
RUN python -m pipenv install --deploy

# Copy rest of the project into image.
COPY . .

# Expose port.
EXPOSE 8000

# Update static and migration on each startup.
ENTRYPOINT ["/app/entrypoint.sh"]

# Final command.
CMD ["python", "-m", "pipenv", "run", "python", "manage.py", "runserver", "0.0.0.0:8000"]
