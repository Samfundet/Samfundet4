
# Forms

SamfForm is a generic system that makes it very easy to create forms for all kinds of data. The system automatically handles validation and UI for you, so you only have to specify things like field names, input type and labels:

```html
<SamfForm onSubmit={yourSubmitFunction} submitButton="Save Name">
    <SamfFormInput field="name" type="text" label="Enter name"/>
</SamfForm>
```

All fields are required by default (so an empty string will not be allowed). When you have filled in the name and click the submit button, `yourSubmitFunction` will be called with the data `{'name': 'whatever you wrote'}` as a parameter.

## Usage

Use the `<SamfForm>` component to create a new form. The component accepts any children, so you can place things in columns or add whatever wrappers you want. Inputs are added using the `<SamfFormField>` component. 

**IMPORTANT:** SamfForm does not care about elements other than `<SamfFormField>`. An `<input>` tag will, for instance, not get validation nor will its data be included in `onSubmit`. 

### Form Properties

Forms should use either `onSubmit` or `onChange`. Submit is useful for typical forms where you post/put data. By defining a form with a type (inside the `< >` after `SamfForm`) you can easily model any datatype.

#### Posting/putting data
```tsx
function postEvent(event: EventDto) {
    // your posting logic
}
```

```tsx
<SamfForm<EventDto> onSubmit={postEvent}>
    <!-- Your input fields -->
</SamfForm>
```

#### Storing data in a state

If the component needs to display some information about the form while you are editing, you can use the `onChanged` property to get notified when data changes. 

```tsx
const [event, setEvent] = useState<EventDto>(undefined);
```
```tsx
<SamfForm<EventDto> onChanged={setEvent}>
    <!-- Your input fields -->
</SamfForm>
```

You can also use `onValidityChanged` to get a simple boolean indicating if the form is valid or not (eg. if some fields are missing). 

#### Setting initial data

If you are changing existing data (for instance in a PATCH form), set the `initialData` property of the form. The form expects a partial object which allows you to only include some of the fields in the Dto.

```tsx
const event: Partial<EventDto> = {
    title_nb: 'some title',
    title_en: 'some title',
}
```
```tsx
<SamfForm<EventDto> initialData={event}>
    <!-- Your input fields -->
</SamfForm>
```

#### Advanced usage

- Set validateOnInit to check validity instantly. Missing fields will be marked with red.
- Set devMode to get a live preview of all the form values, errors and fields

### Input Fields

All inputs area created using `<SamfFormField>`. Required properties are:
- A type indicating which type of input is used, eg. 'text', 'number', 'image', 'date' etc. See `SamfFormFieldTypes`. 
- A field name (string) indicating which property to set. In an `EventDto` you may want to use a field like `title_nb` or `duration`. 

Optional properties include:
- `required` whether the field is valid if empty/undefined. Default `true`.
- `label` a text string label that is shown above the input
- `options` a list of `DropDownOption` used for dropdown inputs
- `defaultOption` a `DropDownOption` set as the default for dropdown inputs
- `validator` a custom validation function which checks special requirements

Example:

```tsx
<SamfFormField type='text' field='title_en' label="English title" />
<SamfFormField type='text-long' field='description_en' label="English description" />
<SamfFormField type='text' field='social_media_url' label="Social media"  required={false}/>
<SamfFormField type='image' field='image' label="Event Image"/>
```

Option Example (with value type inside the `< >`):

```tsx
const myOptions: DropDownOption<number>[] = [
    {value: 1, label: "One"},
    {value: 2, label: "Two"},
]
<SamfFormField<number> type='options' field='number_choice' label="Pick a number" options={myOptions} defaultOption={myOptions[0]}/>
```

## Implementation details

TODO
