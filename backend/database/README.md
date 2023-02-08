# Database

Folder dedicated to group database related files.

## Important

It's important that this folder MUST NOT be added to mounted volume between Docker and localhost.
This folder contains the file `db.sqlite3` which is our database during development.
We do not want to share database between localhost and container.
