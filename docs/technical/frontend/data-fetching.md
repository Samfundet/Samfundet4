# Data fetching

We use the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) (built into browsers) to fetch data.
The `fetch` function is quite simple to use. It returns
a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) that resolves to
the response of the request.

We use [React Query](https://tanstack.com/query/v3) for state management. State management in React is notoriously hard
to get 100% right and safe, which is why using a library such as RQ is a good idea. It saves us from a lot of potential
common bugs and headaches with managing state all by ourselves.

If you're not convinced, read this [great article](https://tkdodo.eu/blog/why-you-want-react-query) by TkDodo on Why You
~~Want~~ Need React Query. It explores a lot of common pitfalls/bugs. At the time of me writing this, these
pitfalls/bugs are found absolutely everywhere we do data fetching in Samfundet4. Hopefully over time, we will replace
these instances with safe state management using RQ.

## Getting started

Please check out the [RQ docs Quick Start](https://tanstack.com/query/latest/docs/framework/react/quick-start).
