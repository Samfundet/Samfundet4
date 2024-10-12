[**&larr; Back: Documentation Overview**](../../README.md)

> [!WARNING]
> SamfForm is deprecated, and will slowly be replaced with [our wrappers](./forms.md) around React Hook Form.

# SamfForm 

SamfForm is a generic react component that makes it very easy to create forms for all kinds of data. The form automatically handles validation and UI for you, so you only have to specify things like field names, input type and labels:

```html
<SamfForm onSubmit={yourSubmitFunction} submitButton="Save Name">
    <SamfFormField field="name" type="text" label="Enter name"/>
    <SamfFormField field="age" type="number" label="Enter age"/>
</SamfForm>
```

All fields are required by default (so an empty string will not be allowed). When you have filled in the name and click the submit button, `yourSubmitFunction` will be called with the entered data, (eg. `{'name': 'Sanctus', 'age': 69}`) as a parameter.

## Usage

- Use the `<SamfForm>` component to create a new form. The component accepts any children, so you can place things in columns or add whatever wrappers you want. 
- Add inputs by placing `<SamfFormField>` components inside the form. You can set labels, value types and validation settings for these inputs.

- **IMPORTANT:** 
    - SamfForm does not care about elements other than `<SamfFormField>`. An `<input>` tag will, for instance, not get validation nor will its data be included in `onSubmit`. 

### Form Properties

Forms should use either `onSubmit` or `onChange`. Submit is useful for typical forms where you post/put data. By defining a form with a type (inside the `< >` after `SamfForm`) you can easily model any datatype.

#### Posting/putting data
```tsx
function postEvent(event: EventDto) {
    // your posting logic
}
```

```html
<SamfForm<EventDto> onSubmit={postEvent}>
    <!-- Your input fields -->
</SamfForm>
```

#### Storing data in a state

If the component needs to display some information about the form while you are editing, you can use the `onChange` property to get notified when data changes. 

```tsx
const [event, setEvent] = useState<EventDto>(undefined);
```
```html
<SamfForm<EventDto> onChange={setEvent}>
    <!-- Your input fields -->
</SamfForm>
```

You can also use `onValidityChanged` to get a simple boolean indicating if the form is valid or not (eg. if some fields are missing). 

#### Setting initial data

If you are changing existing data (for instance when doing a http PATCH), set the `initialData` property of the form. The form expects a partial object which allows you to only include some of the fields in the Dto.

```tsx
const event: Partial<EventDto> = {
    title_nb: 'some title',
    title_en: 'some title',
}
```
```html
<SamfForm<EventDto> initialData={event}>
    <!-- Your input fields -->
</SamfForm>
```

#### Advanced usage

- Set `validateOnInit` to check validity instantly. Missing fields will be marked with red.
- Set `devMode` to get a live preview of all the form values, errors and fields

### Input Fields

All inputs area created using `<SamfFormField>`. Required properties are:
- `type` Which type of input is used, eg. 'text', 'number', 'image', 'date' etc. See `SamfFormFieldTypes`. 
- `field` The name of the property to set. In an `EventDto` you may want to use a field like `title_nb` or `duration`. 

Optional properties include:
- `required` whether the field is invalid when empty/undefined. Default `true`.
- `label` a text string label that is shown above the input
- `options` a list of `DropDownOption` used for dropdown inputs
- `defaultOption` a `DropDownOption` set as the default for dropdown inputs
- `validator` a custom validation function which checks special requirements

Example:

```html
<SamfFormField type="text" field="title_en" label="English title" />
<SamfFormField type="text-long" field="description_en' label="English description" />
<SamfFormField type="text" field="social_media_url" label="Social media"  required={false}/>
<SamfFormField type="image" field="image" label="Event Image"/>
```

Option Example (with value type inside the `< >`):

```tsx
const myOptions: DropDownOption<number>[] = [
    {value: 1, label: "One"},
    {value: 2, label: "Two"},
]
```
```html
<SamfFormField<number> 
    type="options"
    field="some_number_field"
    label="Pick a number" 
    options={myOptions} 
    defaultOption={myOptions[0]}
/>
```

## Implementation details

TODO
