# `/domain/` *modules*

`/domain/` is where code handeling backend interaction is gatherd.
It is seperated into modules: events, documents, images, etc.

## *TanStack Query*

*TanStack Query* - the new name for *React Query* - is how we handle
data parity across the website.

### Files

| File              | Contains                                              |
|-------------------|-------------------------------------------------------|
| `api.ts`          | Axios api call functions                              |
| `types.ts`        | Interfaces, Types, aliases                            |
| `queries.ts`      | Non mutating api calls wrapped in useQuery            |
| `mutations.ts`    | mutating api calls wrapped in useMutation             |
| `queryKeys.ts`    | QueryKey factory                                      |
| `schema.ts`       | Types used in react-hook-form and zod validation      |
| `utils.ts`        | Util functions used in module                         |
| `index.ts`        | Exports content of module                             |

### Folder Structure

```bash
domain/
    events/
        api.ts
        types.ts
        queries.ts
        ...
    images/
        api.ts
        types.ts
        queries.ts
        ...
    utils.ts # Contains util functions useful for all modules
    index.ts # Exports all content from modules
```

#### Api

The base api calls using axios. Both read and write operations.
The api calls should generally not be called by anything outside of
its own module, rather they are called using useQuery and useMutation
to ensure data parity.

#### Types

#### Schema

#### QueryKeys

#### Queries

All queries (get's) are defined here, they are wrapped
in useQuery.

Example

```ts
export function useGetElement(
    id: number,
    // props allows passing of more options for edge case usage
    props?: Partial<UseQueryOptions<ElementDto>> 
) {
  return useQuery({
    // detail(id) creates the queryKey ['events', 'detail', id]
    queryKey: someKeys.detail(id),
    queryFn: () => getSomeElement(id),
    enabled: !!id, // disabled if no id
    ...props, // spreads and overwrites with props
  });
}
```

Usage

```ts
const { data, isLoading } = useGetElement(id);

return (
    <div>
        // if loading display loading, if not display data
        { isLoading ? "Loading" : data}
        // 
    </div>
)
```

#### Mutations

All mutations (creation, updates, deletions) are preformed by useMutations
defined here.

Example

```ts
export function useCreateElement() {
  const queryClient = useQueryClient(); // get queryClient from wrapping provider

  return useMutation({
    mutationFn: (createElementData: CreateElementDataType) => postElement(data),

    onSuccess: () => {
        // Says "Good job you created an entry" to the user
        toast.success(t(KEY.common_creation_successful)); 

        // Invalidates the base queryKey all, this makes all queries out-of-date.
        queryClient.invalidateQueries({ queryKey: eventKeys.all });
    },
  });
}
```

Usage

```ts
const { mutation: createElement } = useCreateElement()

return (
    <button 
        onClick={() => {
            // you can pass props to the mutation function line onSuccess
            createElement(createElementData, { onSuccess: alert("You did it!") })
            // onSuccess runs after confirming a successfull creation
        }
    >
        Create Element!
    </button>
)
```

#### Index

Exports content of module

```ts
export {
    ...
} from './queries.ts'
export {
    ...
} from './mutations.ts'
export {
    ...
} from './types.ts'
export {
    ...
} from './utils.ts'
```

#### Utils

Contains util functions only used by the module.
This file does not have to be created if the module does not
need any util functions.

```ts
export function someUtilFunction() {
    return 'something useful'
}
```
