[**&larr; Back: Documentation Overview**](../README.md#documentation-overview)

# Common error messages

## Rule of thumb

If running the project in Docker, many issues are solved by running a `docker system prune` along with `docker compose build`. This will help i.e. when new dependencies need to be installed on the project.

If you find something that is not listed, please add it to this document!

## Seeding problems

If you are having problems with seeding the database there is usually one single reason; you current local database is out of date. You can solve it by deleting the current database, then seed again.

``` bash
# in Samfundet4/backend/database
rm -f docker.db.sqlite3
```

If you are still having problems then you might need to recreate the database by recraetingt the database with the Django migrate command. See how to do this [here](./docker-project-specific-commands.md).

Still not seeding? Try `docker compose down`, then `docker compose build` and finally `docker compose up`.

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
