[**&larr; Back: Documentation Overview**](./README.md)

# Useful project specific Docker actions

## Frontend
All commands have to be run inside a shell in a container.
```bash
docker compose exec frontend bash
#Command to open the frontend container in a shell
```
🐳To escape the container: 
```bash
exit
```
🐳Biome check
```bash
yarn biome:check
#runs Biome, like in GitHub Actions pipeline, but in Docker
```
🐳Stylelint check
```bash
yarn run stylelint:check
#runs stylelint, like in GitHub Actions pipeline, but in Docker
```
🐳TypeScript Compiler check
```bash
yarn run tsc:check
#runs TypeScript Compiler check, like in GitHub Actions pipeline, but in Docker
```

---

## Backend

All commands have to be run inside a shell in a container.
```bash
docker compose exec backend bash
#Command to open container in a shell
```
### Aliases

🐳The ```migrate``` alias will apply any pending database migrations to update the database schema according to the changes defined in Django. 
```bash
migrate
#equal to "poetry run python /app/manage.py migrate"
```

🐳When you run the ```makemigrations``` alias Django will create database migration files based on any changes to your project's models.
```bash
makemigrations
#equal to "poetry run python /app/manage.py makemigrations"
```

🐳The ```seed``` alias will seed the local database with dummy data. Further docs here: [Seeding](./technical/backend/seed.md). 
```bash
seed
#equal to "poetry run python /app/manage.py seed"
```

🐳The ```collectstatic``` alias will collect and copy the static files from Django apps into the appropriate location as configured in the Django project's settings.
```bash
collectstatic
#equal to "poetry run python /app/manage.py collectstatic --noinput"
```

🐳The ```pipeline``` alias will run the backend GitHub Actions pipeline in Docker.
```bash
pipeline
#equal to "poetry run /app/run-pipeline.sh"
```

