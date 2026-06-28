[**&larr; Back: Documentation Overview
**](../../README.md#documentation-overview)

# Serving React through Django

Having samfundet.no appear in search engines with proper titles, descriptions
and images is an absolute requirement for us. A lot of users use Google to find
events and specific info pages. This introduces some complexity, since we can no
longer just build our frontend React app and serve it as static files, since
then all that Google's indexer sees is the content in `index.html`. We
definitely don't want only "You need to enable JavaScript to run this app"
appearing in search results. Additionally, we miss out on proper HTTP response
codes. If we request `samfundet.no/events/blablabla` we should expect to get a
HTTP 404, but instead get HTTP 200.

Normally, people solve this by adding SSR (server side rendering) to the React
project, but this requires another service running on the server in addition to
our Django backend, which ITK wasn't too keen on.

Instead, we solve this by having Django serve the React frontend. All requests
to Samf4 hit our Django backend, which has knowledge over all frontend routes (
see [Export frontend routes](#export-frontend-routes)), and based on the
requested page, populates `index.html` with the relevant metadata and sets the
correct HTTP status code.

## Export frontend routes

The Django backend needs to serve both its own API routes *and* the frontend
routes.

In order for us to add metadata to the `/events/{id}` frontend page, Django
needs to
know its route/path.

We achieve this by running a frontend script which precompiles all frontend
routes into a format which Django understands (
`backend/samfundet/routing/frontend_routes.py`). We are then able to use the
`EVENT` constant in urlpatterns and pass it to a custom view, in this case named
`react_event_view`.

If a request doesn't match any Django or frontend path, it falls back to
returning the React app, along with a HTTP 404 status code, which will then take
care of displaying the Not Found page.

## Building React app

To precompile the frontend routes, and build the React app into the location
Django expects, run the `build_to_backend.sh` script.

## Setting metadata

Look at the `backend/samfundet/routing/metadata.py` file.

Example:

```python
def event_react_view(request: HttpRequest, **kwargs: Any) -> HttpResponse:
    try:
        event = Event.objects.get(id=kwargs['id'])
    except Event.DoesNotExist:
    # ...

    title = f'{event.title_nb} - Samfundet'
    description = event.description_short_nb

    metadata = Metadata(title=title, description=description)

    # Add custom metadata items
    metadata.items.append(MetadataItem('name', 'og:custom', 'Lorem ipsum'))

    html = get_frontend_html()
    return HttpResponse(inject_metadata(html, metadata))
```
