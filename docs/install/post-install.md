[**&larr; Back: Getting started**](../introduction.md)

# Post-install

You've now (hopefully) successfully installed and started the Samfundet4 project! What now?

We recommend diving in head-first and just picking an [issue](https://github.com/Samfundet/Samfundet4/issues) you'd like
to solve. Be sure to have the [Documentation Overview](../README.md) open and ready for *when* you get stuck :-) If you
find that
some parts of the documentation are lacking, don't be afraid to create a PR to fix it!

## Resetting the database

You'll likely encounter a situation where you'd like to "reset" the database, by deleting all its data and seeding it
again. It's quite easy to do this, the first step is to stop the backend server. Then in the `backend/database`
directory, delete either the `db.sqlite3` if you're running native (or WSL), or the `docker.db.sqlite3` file if you're
running in Docker.

Then simply start the backend server again. This will automatically create the database file and seed it automatically.

## Resetting migrations

If you've done some work in backend and changed/created any models, you'll also have created migration files. You'll
occasionally encounter a situation where you and another developer have both commited migrations with the same number.
Typically the other developer will have gotten their migration file merged to master, resulting in a number conflict in
your branch.

The easiest way to fix this is to simply delete the migration file you have created, and running the `makemigrations`
command again:

* Docker: `docker compose exec backend bash`
  * Then run the same Poetry command as in the line below
* Native: `poetry run python3 manage.py makemigrations`
