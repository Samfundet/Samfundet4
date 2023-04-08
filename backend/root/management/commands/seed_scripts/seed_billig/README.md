# Billig Development

This folder contains files relating to emulating
the billig system for local development.

- `Dockerfile`: Runs billig development database using docker
- `schema.sql`: Defines the database schema for billig_dev
- `seed.py`: Seeds the billig database with dummy data
- `create_billig.sh`: Script that creates the database & schema

## Usage

### Docker (recommended)

Run all docker files using docker-compose.
Inside the root Samfundet4 directory (where `docker-compose.yml` is located), run:

```bash 
docker-compose up
```

Billig dev as well as the regular backend/frontend will start.

### Locally without docker

#### Creating the database

Navigate to the `backend/billig_dev` directory and run:

```bash 
./create_billig.sh
```

In you're not permitted to do this,
the file could not be marked as an executable. To fix, run:

```bash 
chmod +x ./create_billig.sh
```

Then try to run the shell script again.

#### Seeding the database
