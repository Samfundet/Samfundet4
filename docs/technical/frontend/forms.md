[**&larr; Back: Documentation Overview**](../../README.md)

# Forms

We use [React Hook Form](https://react-hook-form.com/) and [Zod](https://zod.dev/) for building and validating frontend
forms. We also use wrapper components (lifted from [shadcn/ui](https://ui.shadcn.com/docs/components/form)), which wrap
around the React Hook Form library. These projects have excellent documentation, so we won't try to replace them here.
This document will simply act as a "Getting started" guide, along with some quick pointers.

We use [zod-i18n](https://github.com/aiji42/zod-i18n) for translating error messages.

## Schema

We define all schema fields in `./frontend/schema/`. This means we only have to define fields once, and lets us easily
create new schemas using existing fields. The form schemas themselves are defined where they are used, meaning alongside
the forms.

Avoid adding options to the fields such as `nullish()`/`optional()`, as those should be decided by the schema using the
fields. The fields should only contain the minimum required for validation. For instance, the `USERNAME` field is
defined like so:

```ts
export const USERNAME = z.string().min(USERNAME_LENGTH_MIN).max(USERNAME_LENGTH_MAX);
```

This lets us easily use it in a Zod schema, and make it optional like so:

```ts
const schema = z.object({
    username: USERNAME.optional(),
});
```

## Defining forms

Always define forms in their own files, to keep code clean.

To get started, create a new file, for example `YourForm.tsx`. This file will contain the form schema and the form
itself. Define a schema using zod. Remember to reuse fields when possible as mentioned in the section above (we won't do
this here for example's sake).

```typescript jsx
import { z } from 'zod';

const schema = z.object({
    username: z.string().min(3).max(24),
});
```

Create your form component, and use the `useForm` hook to create the form.

Create the form component, and use the `useForm` hook with your schema,.

```typescript jsx
export function YourForm() {
    // 1. Define the form
    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            username: '',
        },
    });
    
    // 2. Define the submit handler
    function onSubmit(values: z.infer<typeof schema>) {
        // These values are type-safe and validated
        console.log(values);
    }
}
```

Now use the `Form` wrapper components to build our form.

```typescript jsx
export function YourForm() {
    // ...

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input placeholder="Username" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    );
}
```

## Example

To see an example form in action, check out the form on the [components page](http://localhost:3000/components),
and [its code](../../../frontend/src/Pages/ComponentPage/ExampleForm.tsx).

