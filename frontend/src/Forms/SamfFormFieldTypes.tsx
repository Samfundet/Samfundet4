import { ReactElement } from 'react';
import {
  Checkbox,
  CheckboxProps,
  Dropdown,
  DropdownProps,
  InputFile,
  InputFileProps,
  InputField,
  InputFieldProps,
  TextAreaField,
  TextAreaFieldProps,
  PhoneNumberField,
} from '~/Components';
import { DropDownOption } from '~/Components/Dropdown/Dropdown';
import { ImagePicker, ImagePickerProps } from '~/Components/ImagePicker/ImagePicker';
import { InputFieldType } from '~/Components/InputField/InputField';
import { InputFileType } from '~/Components/InputFile/InputFile';
import styles from './SamfForm.module.scss';

// ================================== //
//         Form Field Types           //
// ================================== //

// SamfFormField types (used to defined field UI in <SamfFormField type=XXX>)

export type FieldProps =
  | TextAreaFieldProps
  | CheckboxProps
  | InputFileProps
  | DropdownProps<number | string>
  | InputFieldProps<InputFieldType>
  | ImagePickerProps;

export type SamfFormFieldType =
  | 'text'
  | 'email'
  | 'text-long'
  | 'password'
  | 'checkbox'
  | 'float'
  | 'integer'
  | 'number'
  | 'options'
  | 'image'
  | 'datetime'
  | 'date'
  | 'time'
  | 'upload-image'
  | 'upload-pdf'
  | 'phonenumber';

/**
 * Arguments used to generate the input component.
 * Field is the key in the object, eg 'title_en'
 * onChange alerts the samf form of changes to automatically
 * handle validation etc.
 */
export type SamfFormFieldArgs = {
  // Shared args for all input types
  field: string; // Field name
  value: unknown; // Current value of field
  onChange(value: unknown): void; // Callback to change field
  error: string | boolean; // True or string message if error, false or undefined if OK
  label?: string; // Text label above the input
  // Custom args for options type
  defaultOption?: DropDownOption<unknown>;
  options?: DropDownOption<unknown>[];
  props?: FieldProps;
};

// Each form type defines a generator function
type GeneratorFunction = (args: SamfFormFieldArgs) => ReactElement;

/**
 * Register form field types here. Each key should map to a function which generates
 * the UI component handling some type of input.
 *
 * Any UI component can be used as long as it calls the onChange function when the value changes.
 * */
export const SamfFormFieldTypeMap: Record<SamfFormFieldType, GeneratorFunction | undefined> = {
  // Standard field inputs use the same function with a type parameter
  // The type here is the standard used for html <input> tags
  text: makeStandardInputFunction<string>('text'),
  number: makeStandardInputFunction<string>('number'),
  float: makeStandardInputFunction<string>('number'),
  integer: makeStandardInputFunction<string>('number'),
  datetime: makeStandardInputFunction<string>('datetime-local'),
  date: makeStandardInputFunction<string>('date'),
  time: makeStandardInputFunction<string>('time'),
  password: makeStandardInputFunction<string>('password'),
  // Custom input types
  'text-long': makeAreaInput,
  options: makeOptionsInput,
  image: makeImagePicker,
  'upload-image': makeFilePickerFunction('image'),
  'upload-pdf': makeFilePickerFunction('pdf'),
  checkbox: makeCheckboxInput,
  email: makeStandardInputFunction<string>('email'),
  phonenumber: makePhoneNumberInput,
};

// ================================== //
//           Form Field UI            //
// ================================== //

// Regular input for text, numbers, dates
function makeStandardInputFunction<U>(type: InputFieldType): GeneratorFunction {
  return function generator(args: SamfFormFieldArgs) {
    const safeVal = args.value === undefined ? '' : (args.value as string);
    return (
      <InputField<U>
        {...(args.props as InputFieldProps<U>)}
        key={args.field}
        value={safeVal}
        onChange={args.onChange}
        error={args.error}
        type={type}
        inputClassName={styles.input_element}
      >
        {args.label}
      </InputField>
    );
  };
}

// Long text input for descriptions etc
function makeAreaInput(args: SamfFormFieldArgs) {
  const safeVal = args.value === undefined ? '' : (args.value as string);
  return (
    <TextAreaField
      {...(args.props as TextAreaFieldProps)}
      key={args.field}
      value={safeVal}
      onChange={args.onChange}
      error={args.error}
      className={styles.input_element}
    >
      {args.label}
    </TextAreaField>
  );
}

// Options dropdown input
function makeOptionsInput(args: SamfFormFieldArgs) {
  const errorBoolean = args.error !== false && args.error !== undefined;
  return (
    <Dropdown
      {...(args.props as DropdownProps<number | string>)}
      key={args.field}
      defaultValue={args.defaultOption}
      options={args.options}
      onChange={args.onChange}
      label={args.label}
      error={errorBoolean}
      className={styles.input_element}
    />
  );
}

// Image picker
function makeImagePicker(args: SamfFormFieldArgs) {
  return <ImagePicker {...(args.props as ImagePickerProps)} key={args.field} onSelected={args.onChange} />;
}

// File picker
function makeFilePickerFunction(fileType: InputFileType) {
  return function makeFilePicker(args: SamfFormFieldArgs) {
    return (
      <InputFile
        {...(args.props as InputFileProps)}
        fileType={fileType}
        key={args.field}
        label={args.label}
        error={args.error}
        onSelected={args.onChange}
      />
    );
  };
}

// Checkbox
function makeCheckboxInput(args: SamfFormFieldArgs) {
  const safeVal = args.value === undefined ? false : (args.value as boolean);
  return (
    <Checkbox
      {...(args.props as CheckboxProps)}
      key={args.field}
      checked={safeVal}
      label={args.label}
      className={styles.input_element}
      onChange={args.onChange}
      error={args.error}
    />
  );
}

// Phonenumber fields
function makePhoneNumberInput(args: SamfFormFieldArgs) {
  const safeVal = args.value === undefined ? '' : (args.value as string);
  return (
    <PhoneNumberField
      {...(args.props as InputFieldProps<string>)}
      key={args.field}
      value={safeVal}
      onChange={args.onChange}
      error={args.error}
      inputClassName={styles.input_element}
    >
      {args.label}
    </PhoneNumberField>
  );
}
