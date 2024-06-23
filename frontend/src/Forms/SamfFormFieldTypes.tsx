import type { ReactElement } from 'react';
import {
  Checkbox,
  type CheckboxProps,
  Dropdown,
  type DropdownProps,
  InputField,
  type InputFieldProps,
  InputFile,
  type InputFileProps,
  PhoneNumberField,
  TextAreaField,
  type TextAreaFieldProps,
} from '~/Components';
import type { DropDownOption } from '~/Components/Dropdown/Dropdown';
import { ImagePicker, type ImagePickerProps } from '~/Components/ImagePicker/ImagePicker';
import type { InputFieldType } from '~/Components/InputField/InputField';
import type { InputFileType } from '~/Components/InputFile/InputFile';
import type { ImageDto } from '~/dto';
import type { SamfError } from './SamfForm';
import styles from './SamfForm.module.scss';

// ---------------------------------- //
//            Return types            //
// ---------------------------------- //
/**
 * Union of all possible return types for SamfFormField.
 */
export type FormFieldReturnType =
  | string
  | number
  | boolean
  | DropDownOption<unknown>
  | ImageDto
  | Date
  | File
  | number[];

// /**
//  * Define a type that checks if a given type is assignable to FormFieldReturnType.
//  * If T is a valid return type for SamfFormField, return true, else false.
//  */
// type IsAllowed<T> = T extends FormFieldReturnType ? true : false;

// /**
//  * Define a type that checks if all properties of an object are assignable to FormFieldReturnType.
//  * If T is a valid type for SamfForm, return true, else false.
//  */
// type ArePropertiesAllowed<T> = {
//   [K in keyof T]: IsAllowed<T[K]>;
// }[keyof T] extends true
//   ? true
//   : false;

// ---------------------------------- //
//               Props                //
// -----------------------------------//
/**
 * Wrapper type for the props of all implemented SamfFormField types.
 */
export type FieldProps =
  | TextAreaFieldProps
  | CheckboxProps
  | InputFileProps
  | DropdownProps<number | string>
  | InputFieldProps<InputFieldType>
  | ImagePickerProps;

/**
 * Arguments used to generate the input component.
 *
 * @param T Type of the form value
 */
export type SamfFormFieldArgs<T extends FormFieldReturnType> = {
  value: T; // Current value of field
  onChange(value: T): void; // Callback to change field
  error: SamfError;
  label?: string; // Text label above the input
  // Custom args for options type
  defaultOption?: DropDownOption<unknown>;
  options?: DropDownOption<unknown>[];
  props?: FieldProps;
};

// ---------------------------------- //
//          Input components          //
// ---------------------------------- //
/**
 * Union of all imput component identifiers. Theese are used to generate the correct input component.
 */
export type SamfFormFieldType =
  | 'text'
  | 'email'
  | 'text_long'
  | 'password'
  | 'checkbox'
  | 'float'
  | 'integer'
  | 'number'
  | 'options'
  | 'image'
  | 'date_time'
  | 'date'
  | 'time'
  | 'upload_image'
  | 'upload_pdf'
  | 'phonenumber';

/**
 * Generator function for a SamfFormField.
 *
 * @param T Returntype of the field generated.
 */
export type GeneratorFunction<T extends FormFieldReturnType> = (args: SamfFormFieldArgs<T>) => ReactElement;

/**
 * Map of all implemented SamfFormField types to their generator functions.
 * */
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const SamfFormGenerators: Record<SamfFormFieldType, GeneratorFunction<any>> = {
  text: makeStandardInputFunction<string>('text'),
  email: makeStandardInputFunction<string>('email'),
  text_long: makeAreaInput,
  password: makeStandardInputFunction<string>('password'),
  checkbox: makeCheckboxInput,
  float: makeStandardInputFunction<number>('number'),
  integer: makeStandardInputFunction<number>('number'),
  number: makeStandardInputFunction<number>('number'),
  options: makeOptionsInput,
  image: makeImagePicker,
  date_time: makeStandardInputFunction<Date>('datetime-local'),
  date: makeStandardInputFunction<Date>('date'),
  time: makeStandardInputFunction<Date>('time'),
  upload_image: makeFilePickerFunction('image'),
  upload_pdf: makeFilePickerFunction('pdf'),
  phonenumber: makePhoneNumberInput,
};

// Regular input for text, numbers, dates
function makeStandardInputFunction<U extends FormFieldReturnType>(type: InputFieldType): GeneratorFunction<U> {
  return function generator(args: SamfFormFieldArgs<U>) {
    const safeVal = args.value === undefined ? '' : (args.value as string);
    return (
      <InputField<U>
        {...(args.props as InputFieldProps<U>)}
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
function makeAreaInput(args: SamfFormFieldArgs<string>) {
  const safeVal = args.value === undefined ? '' : (args.value as string);
  return (
    <TextAreaField
      {...(args.props as TextAreaFieldProps)}
      value={safeVal}
      onChange={args.onChange}
      error={args.error}
      className={styles.input_element}
    >
      {args.label}
    </TextAreaField>
  );
}

// Checkbox
function makeCheckboxInput(args: SamfFormFieldArgs<boolean>) {
  const safeVal = args.value === undefined ? false : (args.value as boolean);
  return (
    <Checkbox
      {...(args.props as CheckboxProps)}
      checked={safeVal}
      label={args.label}
      className={styles.input_element}
      onChange={args.onChange}
      error={args.error}
    />
  );
}

// Options dropdown input
// # issue 1090
function makeOptionsInput(args: SamfFormFieldArgs<DropDownOption<unknown>>) {
  const errorBoolean = args.error !== false && args.error !== undefined;
  return (
    <Dropdown<unknown>
      {...(args.props as DropdownProps<number | string>)}
      defaultValue={args.defaultOption}
      options={args.options}
      onChange={args.onChange as (value?: unknown) => void}
      label={args.label}
      error={errorBoolean}
      className={styles.input_element}
    />
  );
}

// Image picker
function makeImagePicker(args: SamfFormFieldArgs<ImageDto>) {
  return <ImagePicker {...(args.props as ImagePickerProps)} onSelected={args.onChange} />;
}

// File picker
function makeFilePickerFunction(fileType: InputFileType) {
  return function makeFilePicker(args: SamfFormFieldArgs<ImageDto | File>) {
    return (
      <InputFile
        {...(args.props as InputFileProps)}
        fileType={fileType}
        label={args.label}
        error={args.error}
        onSelected={args.onChange}
      />
    );
  };
}

// Phonenumber fields
function makePhoneNumberInput(args: SamfFormFieldArgs<string>) {
  const safeVal = args.value === undefined ? '' : (args.value as string);
  return (
    <PhoneNumberField
      {...(args.props as InputFieldProps<string>)}
      value={safeVal}
      onChange={args.onChange}
      error={args.error}
      inputClassName={styles.input_element}
    >
      {args.label}
    </PhoneNumberField>
  );
}
