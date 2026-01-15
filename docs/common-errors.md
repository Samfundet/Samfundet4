[**&larr; Back: Documentation Overview**](../README.md#documentation-overview)

# Common error messages

## Rule of thumb

If running the project in Docker, many issues are solved by running a `docker system prune` along with `docker compose build`. This will help i.e. when new dependencies need to be installed on the project.

If you find something that is not listed, please add it to this document!

## Seeding problems

If you are having problems with seeding the database there is usually one single reason; your current local database is out of date. You can solve it by deleting the current database, then seeding again.

Delete volumes:
``` bash
docker compose down --volumes
```

Build, migrate and seed:
``` bash
docker compose up -d --build
docker compose exec backend bash
migrate
seed
```

## Entrypoint.sh
### Error message:
```
exec /app/entrypoint.sh: no such file or directory
```
### Fix
 Make sure `/backend/entrypoint.sh` has `End of Line sequence set` to `LF` (Happens when running on windows).

## Docker daemon not running
### Error message:
```
Cannot connect to the Docker daemon at ../../.../default/docker.sock. Is the docker daemon running?
```
### Fix:
Make sure docker desktop is running (Windows) or run `colima start` (or start Docker Desktop) on Mac.
