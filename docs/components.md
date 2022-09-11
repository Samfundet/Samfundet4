[docs](/docs/README.md) / [conventions](/docs/conventions/README.md) / [components](components.md)

# Components

How to write react components in `Samfundet4`.
This document will show examples of desired component-structure, followed by a detailed list of conventions we aim to use as default when creating new components.

> It's not expected to always keep every component up-to-date, this is simply a baseline. Some components may not fit these conventions.

<br>
<hr>
<br>

## Examples:

> Star (`*`) annotates a folder.  
> Dash (`-`) annotates a file.

<br>

### Generic component:

```
* ...
* Components
    * SomeGenericComponent
        - index.ts
        - SomeGenericComponent.scss
        - SomeGenericComponent.stories.scss
        - SomeGenericComponent.tsx
        - utils.tsx
* ...
```

<br>

### Page component with sub-components:

```
* ...
* Pages
    * SomePage
        * components
            - index.ts
            * SomeSub
        * utils
            - index.ts
            - navigation.ts
            - namespacing.ts
        - index.ts
        - SomePage.scss
        - SomePage.tsx
        - testdata.ts
* ...
```

<br>
<hr>
<br>

## How to write a component

<br>

### Generic (reusable) component

Component written for reusability. These components are typically included in the design system. They only accept props and do not depend on Redux or Context.

-   Located under `Components/`
-   Contains storybook file `<component-name>.stories.tsx`.
-   Follows the other conventions in [### Composed component](#composed-component)

<br>

### Composed component

Component built for some parts of the application. Typically not reusable. They can be smart components that manage heavy logic or simply a normal component for visual purposes. Accepts props, redux, and context functionality depending on individual use cases.

1. Created inside a folder with its name `<component-name>` in PascalCase.
2. The folder has a `<component-name>.tsx` file with the same name.
3. The file exports the React node `export function <component-name>() {...}` with the same name.
4. The folder contains an `index.ts` to expose the component.
5. May contain `<component-name>.scss` file for styling.
6. May contain `types.ts` to group types used by the component or sub-components.
7. May contain `testdata.ts` to write objects or generators for easy testing.
8. May contain `utils.ts` to group helper-functions and other constants.
    - If the file grows too big. Create a folder `utils` and group functions into named files instead.
9. May contain a folder `__tests__` containing a `<component-name>.test.tsx` file.
10. May contain a folder `components` to group sub-components.
    - These conventions are recursive, meaning sub-components have the same structure.
11. Top-level components such as pages should be suffixed with `Page`.
