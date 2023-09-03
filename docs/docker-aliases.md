# Useful Docker aliases

## For backend actions:

All commands has to be run inside a shell in a container.
```bash
docker compose exec backend bash
#Command to open container in a shell
```
🐳To escape the container: 
```bash
exit
```
### Aliases

🐳The ```migrate``` alias will apply any pending database migrations to update the database schema according to the changes defined in Django. 
```bash
migrate
#equal to "pipenv run python /app/manage.py migrate"
```

🐳When you run the ```makemigrations``` alias Django will create database migration files based on any changes to your project's models.
```bash
makemigrations
#equal to "pipenv run python /app/manage.py makemigrations"
```

🐳The ```seed``` alias will seed the local database with dummy data. Further docs here: [Seeding](./technical/backend/seed.md). 
```bash
seed
#equal to "pipenv run python /app/manage.py seed"
```

🐳The ```collectstatic``` alias will collect and copy the static files from Django apps into the appropriate location as configured in the Django project's settings.
```bash
collectstatic
#equal to "pipenv run python /app/manage.py collectstatic --noinput"
```

🐳The ```pipeline``` alias will run the backend GitHub Actions pipeline in Docker.
```bash
pipeline
#equal to "pipenv run /app/run-pipeline.sh"
```

