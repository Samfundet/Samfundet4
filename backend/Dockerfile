##################################################
# MULTI-STAGE BUILD DOCKERFILE                  #
# This Dockerfile uses a multi-stage build to:  #
# 1. Separate build dependencies from runtime   #
# 2. Create a smaller final image               #
# 3. Improve rebuild performance via caching    #
#                                                #
# NOTE: This is for DEVELOPMENT use only        #
##################################################

# =============================================================================
# STAGE 1: DEPENDENCIES
# Purpose: Install heavy build tools and compile Python packages
# This stage contains tools we need to BUILD but not to RUN the application
# =============================================================================
FROM python:3.11.2-slim-bullseye AS dependencies

##################################
#     Environment variables      #
##################################
# PYTHONUNBUFFERED=1: Forces Python to send stdout/stderr straight to terminal without buffering
#                     This ensures real-time log output in Docker containers
ENV PYTHONUNBUFFERED=1

# PYTHONDONTWRITEBYTECODE=1: Prevents Python from creating .pyc bytecode files
#                            Keeps the container clean and reduces size
ENV PYTHONDONTWRITEBYTECODE=1

# POETRY_VIRTUALENVS_IN_PROJECT=1: Tells Poetry to create the virtual environment 
#                                   in the project directory (.venv) instead of
#                                   in Poetry's cache directory
ENV POETRY_VIRTUALENVS_IN_PROJECT=1

##################################
#   Build-time dependencies      #
##################################
# These packages are needed to compile Python packages with C extensions:
# - gcc: GNU C compiler, needed to compile C extensions
# - libpq-dev: PostgreSQL development files (headers), needed to compile psycopg2
# - python3-dev: Python development headers, needed for packages with C extensions
#
# set -eux: Shell options for safer scripting:
#   -e: Exit immediately if any command fails
#   -u: Treat unset variables as errors
#   -x: Print each command before executing (for debugging)
RUN set -eux && \
    apt-get update && \
    apt-get install -y --no-install-recommends gcc libpq-dev python3-dev && \
    python -m pip install poetry && \
    # Clean up apt cache to reduce image size
    rm -rf /var/lib/apt/lists/* && \
    # This PATH export doesn't persist (each RUN starts fresh) - consider removing
    export PATH=/usr/lib/postgresql/X.Y/bin/:$PATH

# Set working directory for subsequent commands
WORKDIR /app

# Copy only dependency files first (not the entire codebase)
# This allows Docker to cache this layer and skip reinstalling dependencies
# if pyproject.toml and poetry.lock haven't changed
COPY pyproject.toml poetry.lock* ./

# Create virtual environment directory and install Python dependencies
# --sync: Ensures the environment matches poetry.lock exactly
RUN mkdir .venv && poetry install --sync

# =============================================================================
# STAGE 2: FINAL IMAGE
# Purpose: Create the runtime environment with only what's needed to RUN
# This stage will be much smaller as it excludes build tools
# =============================================================================
FROM python:3.11.2-slim-bullseye AS final

##################################
#         Exposed ports          #
##################################
# Port 8000: Django development server default port
EXPOSE 8000

# Port 5678: Python debugger (debugpy) for remote debugging
#            Allows IDEs to connect for debugging sessions
EXPOSE 5678

##################################
#     Environment variables      #
##################################
# Same environment variables as build stage - needed at runtime too
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1
ENV POETRY_VIRTUALENVS_IN_PROJECT=1

##################################
#    Runtime dependencies only   #
##################################
# Install ONLY what's needed to RUN the application:
# - libpq5: PostgreSQL client library (runtime only, no headers)
#           This is all psycopg2 needs to connect to PostgreSQL
# - poetry: Needed to run the application with 'poetry run'
#
# Notice: NO gcc, libpq-dev, or python3-dev (build tools not needed at runtime)
RUN set -eux && \
    apt-get update && \
    apt-get install -y --no-install-recommends libpq5 && \
    python -m pip install poetry && \
    # Clean up apt cache to reduce image size
    rm -rf /var/lib/apt/lists/*

##################################
#      Developer shortcuts       #
##################################
# Create helpful aliases for common Django commands
# These make development easier when working inside the container
# Example usage: docker exec -it <container> bash, then just type 'migrate'
RUN echo 'alias la="ls -la"' >> ~/.bashrc && \
    echo 'alias migrate="poetry run python /app/manage.py migrate"' >> ~/.bashrc && \
    echo 'alias makemigrations="poetry run python /app/manage.py makemigrations"' >> ~/.bashrc && \
    echo 'alias seed="poetry run python /app/manage.py seed"' >> ~/.bashrc && \
    echo 'alias collectstatic="poetry run python /app/manage.py collectstatic --noinput"' >> ~/.bashrc && \
    echo 'alias pipeline="poetry run /app/run-pipeline.sh"' >> ~/.bashrc && \
    # This line might be redundant or reference a missing file - verify if needed
    echo 'source aliases.sh' >> ~/.bashrc

# Set working directory for the application
WORKDIR /app

# IMPORTANT: Copy the pre-built virtual environment from the dependencies stage
# This is the key benefit of multi-stage builds - we get compiled packages
# without keeping the build tools in our final image
COPY --from=dependencies /app/.venv /app/.venv

# Copy dependency files (needed by Poetry to understand the project)
COPY pyproject.toml poetry.lock* ./

# Copy the entire application code
# This is done LAST so that code changes don't invalidate the layers above
# When you change code, Docker only rebuilds from this point forward
COPY . /app

# ENTRYPOINT: The script that always runs when container starts
# This typically handles environment setup, database checks, etc.
ENTRYPOINT ["/app/entrypoint.sh"]

# CMD: Default command (can be overridden with docker run)
# Starts the Django development server on all interfaces (0.0.0.0)
CMD ["poetry", "run", "python", "manage.py", "runserver", "0.0.0.0:8000"]