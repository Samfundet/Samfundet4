import { ReactElement, useEffect, useState } from 'react';
import { InputField } from '~/Components';
import { Children } from '~/types';

type FormFieldType = 'text' | 'text-long' | 'number';

export type FormField = {
  key: string;
  type: FormFieldType;
  label?: ReactElement | string;
  required?: boolean;
}

type FormProps<T> = {
  initialData?: Partial<T>;
  layout: FormField[][];
  validator<FormDataType>(data: FormDataType): boolean;
  onChange<T>(data: Partial<T>): void;
};

export function GenericForm<T>({ initialData, layout, validator, onChange }: FormProps<T>) {

  const [formData, setFormData] = useState<Record<string, unknown>>(initialData ?? {})
  
  // Update form data
  function updateValue<T>(field: FormField, newValue: T) {
    setFormData({
      ...formData,
      [field.key]: newValue
    })
  }

  // Alert parent of change
  useEffect(() => {
    const out: Partial<T> = {
      ...initialData,
      ...formData
    }
    onChange<T>(out);
  }, [formData])

  // Regular text input
  function makeTextInput(field: FormField) {
    return (
      <InputField placeholder="some" onChange={(v) => updateValue(field, v)}>
        {field.label}
      </InputField>
    );
  }

  function makeFieldInput(field: FormField) {
    const value = formData[field.key];
    const isInvalid = field.required !== false && (value === undefined || value === '')
    return (
      <div key={field.key}>
        <br></br>
        <p>Field '{field.key}' of type '{field.type as string}'</p>
        <p style={{ color: isInvalid ? 'red' : 'black' }}>Field value: {formData[field.key] as string}</p>
        <p>Field initial: {(initialData as Record<string, unknown>)[field.key] as string}</p>
        <br></br>
        {field.type === 'text' && makeTextInput(field)}
      </div>
    );
  }

  function makeRow(row: FormField[]): Children {
    return (
      <div style={{ display: 'flex', gap: '1em' }}>
        {row.map((field) => makeFieldInput(field))}
      </div>
    );
  }

  return (
    <form>
      {layout.map((row) => makeRow(row))};
    </form>
  );
}
