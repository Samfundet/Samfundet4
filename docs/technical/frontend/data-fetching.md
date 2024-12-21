[**&larr; Back: Documentation Overview**](../../../README.md#documentation-overview)

# Data fetching and State management

We use the [Axios HTTP client](https://axios-http.com/docs/intro) to fetch data. It's quite simple to use, returning a
[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) resolving to the
response of the request.

We use [React Query](https://tanstack.com/query/v3) for state management. State management in React is notoriously hard
to get 100% right and safe, which is why using a library such as RQ is a good idea. It saves us from a lot of potential
common bugs and headaches with managing state all by ourselves.

If you're not convinced, read this [great article](https://tkdodo.eu/blog/why-you-want-react-query) by TkDodo on _Why
You ~~Want~~ Need React Query_. It explores a lot of common pitfalls/bugs. At the time of me writing this, these
pitfalls/bugs are found absolutely everywhere we do data fetching in Samfundet4. Hopefully over time, we will replace
these instances with safe state management using RQ.

## Getting started

So how do these two libraries hang together in our project? Well, we typically start by writing a very simple function
which only contains an Axios call to send a request and return the data from the response. We do this
in `frontend/src/api.ts`. Then in our components and pages and
whatnot, we use React Query to be responsible for actually calling this function when needed.

To get started, in our component/page, call the `useQuery` hook like so, providing a query key and the query function:

```ts
const { data, isLoading, isError } = useQuery({
  queryKey: ['informationpages'],
  queryFn: getInformationPages,
});
```

The project has a single global _Query Client_. This acts kind of like a global request and response cache. It contains
all the data fetched by the `useQuery` hook. You can think of it as a simple Key-Value store. In the above example, the
data fetched by the `getInformationPages` function is stored by the Query Client using the query key. The query key
therefore needs to be unique for the data we're fetching.

## Query key factory

Since it's extremely important that the query keys are unique, we employ a "query key factory" to generate them for us.
The factories are all defined in one place ([queryKeys.ts](../../../frontend/src/queryKeys.ts)), which should eliminate
the possibility of key collisions. Here are some examples of how to use the factories:

```ts
// Get all information pages
const { data } = useQuery({
  queryKey: infoPageKeys.all,
  queryFn: getInformationPages,
});
```

```ts
// Get specific user
const { data } = useQuery({
  queryKey: userKeys.detail(userId),
  queryFn: () => getUser(userId),
});
```

```ts
// Get information pages with filter
const { data } = useQuery({
  queryKey: infoPageKeys.list([search, page]),
  queryFn: () => getInformationPages(search, page),
});
```

## Invalidating data

Sometimes we need to invalidate data which has been fetched. An example case is when we create and save a new object, an
information page for instance, we want to clear our "information pages" cache, so that when we request all information
pages again, the data returned includes the new object.

Doing this is quite simple with the query key factory, and we are able to invalidate on multiple levels of granularity:

```ts
// Invalidate absolutely all information page data
queryClient.invalidateQueries({
  queryKey: infoPageKeys.all,
});

// Invalidate all information page lists
queryClient.invalidateQueries({
  queryKey: infoPageKeys.lists(),
});

// Invalidate a specific information page's data
queryClient.invalidateQueries({
  queryKey: infoPageKeys.detail(id),
});
```

## Error handling

We have a very simple error handler defined in the _Query Client_. If the query function returns an error (for instance,
HTTP 500), we will log it as an error to the console, and display a toast with an error message. This error message is
by default generic (i.e. "Something went wrong!"), but it can be overwritten by the useQuery-caller if desired. We do
this using the `meta` and `errorMsg` options in the useQuery hook.

```ts
const { data, isLoading, isError } = useQuery({
  queryKey: infoPageKeys.all,
  queryFn: getInformationPages,
  meta: {
    errorMsg: "We couldn't find the pages!",
  },
});
```

In the example above, if `getInformationPages` raises an error, we'll get a toast with "We couldn't find the pages!".
Note that you can (and should) use translations here as well:

```ts
const { data, isLoading, isError } = useQuery({
  queryKey: infoPageKeys.all,
  queryFn: getInformationPages,
  meta: {
    errorMsg: t(KEY.something_something),
  },
});
```

## Further reading

React Query doesn't only have to be used for API calls, we also use it for other async tasks.

Please check out the [RQ docs Quick Start](https://tanstack.com/query/latest/docs/framework/react/quick-start).

Also check out TkDodo's (RQ maintainer) [blog posts](https://tkdodo.eu/blog/practical-react-query)
