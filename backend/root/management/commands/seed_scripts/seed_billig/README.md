# Billig Development Database

This folder contains files relating to emulating
the billig system for local development.

- `schema.sql`: Defines the database schema for billig_dev
- `util.py`: Utility functions for seeding
- `../billig.py`: The main seed script for billig_dev

Since the billig database is separate from django (in production),
we need to emulate it for development.

The seed script handles the creating of the sqlite3
database using shell scripts, and seeds the tables
directly using raw SQL queries.



