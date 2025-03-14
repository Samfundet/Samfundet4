[**&larr; Back: Documentation Overview**](../../../README.md#documentation-overview)

# Billig Integration

<img src="./billig_meme.png" />

Billig is the ticket/payment system implemented by ITK.
We need to integrate with this system on cirkus to support
a payment form with tickets and showing ticket pdfs. 

## Databases

The billig database is not managed by django. 
In production, the database router simply routes 
all Billig models to the production database in cirkus. In local development queries are routed to an sqlite3 file
in the `/databases/` folder (`billig.db.sqlite3`).

The database router is implemented in the `db_router.py` file, and 
added to django in settings (`dev.py`/`prod.py` etc).

The billig_dev database is generated by the `/seed_scripts/billig.py` seed script. 
Since the models are not managed, this script is pretty specialized 
and generates the database schema using raw SQL. The point of this is to create a mirror of the real production database 
that we can test with. For the actual seeding we just use django models as usual.

### Usage

Luckily we don't need to think about all this when using billig in our API.
The django integration handles everything in the background, so you
can focus on other stuff.

For most API endpoints we just serialize stuff, and the event serializer 
handles everything billig-related for you. By doing:

```python
event = Event.objects.all()
serial = EventSerializer(event, many=True).data
```

the serializer will connect to billig in the background, 
and you get a list of json dicts containing the billig information 
for each event. 

### Performance

You can use billig simply by doing `event.billig`, but this is very slow in a loop because it causes a single SQL query for every event. Since billig is not a "true" foreign key you cannot use `prefetch_related`, but you can use the custom function `Event.prefetch_billig`. **Always use prefetching when working with many events, for instance:** 

```python
# Single event is fine!
event = Event.objects.first()
print(event.billig.ticket_groups[0].price_groups[0].name) #OK!

# Prefetch for many events
events = Event.objects.all()
Event.prefetch_billig(events)
for event in events:
  print(event.billig.ticket_groups[0].price_groups[0].name)
```

You can also specify if you don't need everything to make it even faster, e.g. `Event.prefetch_billig(events, tickets=True, prices=False)`.

### OMFG billig is changing

Of course this happened. Here are a few tips:

- The first thing you should do is to create a local development database
equivalent to the new billig database for testing
- When adding/renaming columns, make sure you add them
to the `seed_billig/schema.sql` file with the same names as in billig prod. 
- Add fields to the respective `Billig` model in `billig.py` with
correct column names.
- Make sure you update the billig seed script with the correct fields
to enable testing. 
- Update the billig serializers to include the new fields
- ????
- Profit. Literally. 

### OMFG we are switching away from billig

Use what you've learnt from billig and find some experienced
pangs to help you out. Good luck!
