[**&larr; Back: Getting started**](../introduction.md)

# Installing on MacOS (Docker)

## Requirements

* [Homebrew](https://docs.brew.sh/Installation)
* [colima](https://github.com/abiosoft/colima?tab=readme-ov-file#getting-started)
  or [Docker Desktop](https://www.docker.com/products/docker-desktop/)
    * colima can be more performant than Docker Desktop, but is less easy to use

## Installing

First clone the Samfundet4 repository.

```bash
git clone git@github.com:Samfundet/Samfundet4.git
```

If you use colima, run `colima start` to start the engine.

## Environment files

Both the `frontend` and `backend` directories contain a `.docker.example.env` file. Copy these files to `.docker.env`
and adjust any values as needed. You may for example want to change the default Django superuser username and
password (`DJANGO_SUPERUSER_USERNAME` and `DJANGO_SUPERUSER_USERNAME`).

## Building

This builds all the Samfundet4 containers:

```bash
cd Samfundet4
docker compose build

# You can also choose to build only specific containers if you want:
docker compose build frontend backend
```

## Running

This will start the `backend` and `frontend` containers:

```bash
docker compose up backend frontend
```

## Post-install

Now that you've got the project up and running, check out the post-install instructions:

<h3 align="right">
<a href="/docs/install/post-install.md">&rarr; Next: Post-install</a>
</h3>
