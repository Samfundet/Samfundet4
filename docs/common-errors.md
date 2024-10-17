# Common error messages

## Rule of thumb

If running the project in Docker, many issues are solved by running a `docker system prune` along with `docker compose build`. This will help i.e. when new dependencies need to be installed on the project.

If you find something that is not listed, please add it to this document!

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
Make sure docker desktop is running (Windows) or run `colima start`on Mac.
