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
#       uv: package manager      #
##################################
# uv replaces pip + poetry + pyenv + virtualenv. We copy the static uv/uvx
# binaries from Astral's published image instead of installing via pip.
# https://docs.astral.sh/uv/guides/integration/docker/
COPY --from=ghcr.io/astral-sh/uv:0.9.11 /uv /uvx /bin/

##################################
#     Environment variables      #
##################################
# Forces Python to send stdout/stderr straight to terminal without buffering.
# This ensures real-time log output in Docker containers
ENV PYTHONUNBUFFERED=1

# Prevents Python from creating .pyc bytecode files. Keeps the container clean and reduces size
ENV PYTHONDONTWRITEBYTECODE=1

# Where uv creates/uses the virtual environment.
# Pinned to a fixed path so the final stage can copy it.
ENV UV_PROJECT_ENVIRONMENT=/app/.venv

# Compile .pyc on install for faster container startup.
ENV UV_COMPILE_BYTECODE=1

# Copy packages into the venv (avoids hardlink warnings across mounts).
ENV UV_LINK_MODE=copy

# Use the Python provided by this base image instead of downloading a managed interpreter. The managed interpreter
# would live outside .venv and would NOT exist in the final stage (we only copy /app/.venv), so the venv must be
# built against the image's own Python.
ENV UV_PYTHON_PREFERENCE=only-system

##################################
#   Build-time dependencies      #
##################################
# These packages are needed to compile Python packages with C extensions:
# - gcc: GNU C compiler, needed to compile C extensions
# - libpq-dev: PostgreSQL development files (headers), needed to compile psycopg[c]
# - python3-dev: Python development headers, needed for packages with C extensions
#
# set -eux: Shell options for safer scripting:
#   -e: Exit immediately if any command fails
#   -u: Treat unset variables as errors
#   -x: Print each command before executing (for debugging)
RUN set -eux && \
    apt-get update && \
    apt-get install -y --no-install-recommends gcc libpq-dev python3-dev && \
    # Clean up apt cache to reduce image size
    rm -rf /var/lib/apt/lists/*

# Set working directory for subsequent commands
WORKDIR /app

# Copy only dependency files first (not the entire codebase)
# This allows Docker to cache this layer and skip reinstalling dependencies
# if pyproject.toml and uv.lock haven't changed
COPY pyproject.toml uv.lock ./

# Install Python dependencies into /app/.venv from the lockfile.
# --frozen: fail instead of updating the lockfile (it must match pyproject.toml).
# --no-install-project: this is an application, not an installable package.
RUN uv sync --frozen --no-install-project

# =============================================================================
# STAGE 2: FINAL IMAGE
# Purpose: Create the runtime environment with only what's needed to RUN
# This stage will be much smaller as it excludes build tools
# =============================================================================
FROM python:3.11.2-slim-bullseye AS final

# Copy the uv binaries so `uv run ...` works at runtime (used by entrypoint/CMD/aliases).
COPY --from=ghcr.io/astral-sh/uv:0.9.11 /uv /uvx /bin/

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
ENV UV_PROJECT_ENVIRONMENT=/app/.venv
ENV UV_LINK_MODE=copy
ENV UV_PYTHON_PREFERENCE=only-system
# At runtime `uv run` must never mutate the lock or hit the network, instead it
# just uses the venv copied from the dependencies stage.
ENV UV_FROZEN=1

##################################
#    Runtime dependencies only   #
##################################
# Install ONLY what's needed to RUN the application:
# - libpq5: PostgreSQL client library (runtime only, no headers)
#           This is all psycopg needs to connect to PostgreSQL
#
# Notice: NO gcc, libpq-dev, or python3-dev (build tools not needed at runtime)
RUN set -eux && \
    apt-get update && \
    apt-get install -y --no-install-recommends libpq5 && \
    # Clean up apt cache to reduce image size
    rm -rf /var/lib/apt/lists/*

##################################
#      Developer shortcuts       #
##################################
# Create helpful aliases for common Django commands
# These make development easier when working inside the container
# Example usage: docker exec -it <container> bash, then just type 'migrate'
RUN echo 'alias la="ls -la"' >> ~/.bashrc && \
    echo 'alias migrate="uv run python /app/manage.py migrate"' >> ~/.bashrc && \
    echo 'alias makemigrations="uv run python /app/manage.py makemigrations"' >> ~/.bashrc && \
    echo 'alias seed="uv run python /app/manage.py seed"' >> ~/.bashrc && \
    echo 'alias collectstatic="uv run python /app/manage.py collectstatic --noinput"' >> ~/.bashrc && \
    echo 'alias pipeline="uv run /app/run-pipeline.sh"' >> ~/.bashrc && \
    # This line might be redundant or reference a missing file - verify if needed
    echo 'source aliases.sh' >> ~/.bashrc

# Set working directory for the application
WORKDIR /app

# IMPORTANT: Copy the pre-built virtual environment from the dependencies stage
# This is the key benefit of multi-stage builds - we get compiled packages
# without keeping the build tools in our final image
COPY --from=dependencies /app/.venv /app/.venv

# Copy dependency files (needed by uv to understand the project)
COPY pyproject.toml uv.lock ./

# Copy the entire application code
# This is done LAST so that code changes don't invalidate the layers above
# When you change code, Docker only rebuilds from this point forward
COPY . /app

# ENTRYPOINT: The script that always runs when container starts
# This typically handles environment setup, database checks, etc.
ENTRYPOINT ["/app/entrypoint.sh"]

# CMD: Default command (can be overridden with docker run)
# Starts the Django development server on all interfaces (0.0.0.0)
CMD ["uv", "run", "python", "manage.py", "runserver", "0.0.0.0:8000"]
