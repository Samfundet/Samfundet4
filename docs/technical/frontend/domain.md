# What is `/domain/`

Domain is where all functions, hooks and types related to data transfer
from backend -> frontend and vice versia is gartered.
It consists of directories containing slices of related objects
within

## File setup

| Files                      | Content                                       |
|----------------------------|-----------------------------------------------|
| `/domain/.../api.ts`       | The axios api calls that fetches the data     |
| `/domain/.../queries.ts`   | Queries on data (get)                         |
| `/domain/.../mutations.ts` | Mutations on data (put, post, delete)         |
| `/domain/.../queryKeys.ts` | QueryKey factory                              |
| `/domain/.../types.ts`     | All related types                             |
| `/domain/.../schema.ts`    | Types used in zod schemas and forms           |
| `/domain/.../index.ts`     | Exports the contents of the above files       |

### midheding

#### Api

Contains the axios api calls to fetch data.
The functions should generaly not be called outside of
`mutations.ts` and `queries.ts`.

#### Queries

All `useQuery` predefined hooks to get up-to-date data
to the frontend. Does not *mutate* any data.

#### Mutations

predefined `useMutation` hooks for easy mutation of data by users.

If mutations are done via direct api calls then the frontend does not 
automaticaly know that something has changed.

#### QueryKeys

#### Types

#### Schema

#### Index
