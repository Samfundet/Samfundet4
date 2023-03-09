
[👈 back](/docs/README.md)

# Development Tips

## Seeding the database

Seed scripts are used to populate the database with dummy data for testing. Seed scripts are located in `root/management/commands/seed_scripts/`.

### Seeding commands

To seed the database locally, run this in terminal:

- `python manage.py seed`

To seed specific tables (eg. events), use a name parameter:

- `python manage.py seed <name>`

For instance, to seed events run:

- `python manage.py seed events`

### Seeding in docker 

After docker container is running, send command to the container:

`docker compose exec backend python -m pipenv run python manage.py seed`

I find this very long and messy, so I prefer to have a terminal window inside the docker container all the time:

- Go into docker: `docker exec backend bash`
- Enable pipenv: `pipenv shell` 
- Run seed script: `python manage.py seed`

### Adding/changing seed scripts

The seed script `seed.py` does not need to be modified to add new seed scripts.
Instead, add scripts inside the `seed_scripts/` folder. In order for them to be detected, you must include it in the `seed_scripts/__init__.py` file:

```python
from . import your_seed_script

SEED_SCRIPTS = [
    # ... 
    ('your_name', your_seed_script.your_function) # Add here
]
```

Seed scripts only have to have a single function (set in the SEED_SCRIPTS list), but could be as complex as you want. A typical seed script will look like this:

```python
COUNT = 10

def seed():

    # It is good practise to delete old objects to prevent lots of duplicates
    SomeObject.objects.all().delete()
    yield 0, 'Deleted old stuff'

    # Loop for some number of steps
    for i in range(COUNT):

        # Create object
        SomeObject.objects.create(
            something=i,
            # ... other fields
        )

        # Yield progress (number between 1-100) and a descriptive string. 
        # Used for pretty loading indicators.
        yield i / COUNT, f"Created some object '{i}'"

    # Done! Yield 100 to show a finished loading bar, and a final description
    yield 100, f'Created {len(Venue.objects.all())} venues'
```

Checkout python generators to see how yield works. In short, the function basically works as a list that is computed in real time, so inside `seed.py` the script "loops through" the seed function and prints progress over time. Good luck!
