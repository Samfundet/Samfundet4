import { ReactElement, useEffect, useState } from 'react';
import { InputField } from '~/Components';
import { InputFieldType } from '~/Components/InputField/InputField';
import { Children } from '~/types';

type FormFieldType = 'text' | 'text-long' | 'number';
type FormFieldValidation = 'submit' | 'change';

export type FormField<T> = {
  key: string;
  type: FormFieldType;
  label?: ReactElement | string;
  required?: boolean;
  validator?<T>(data: T): boolean | string;
};

type FormProps<T> = {
  initialData?: Partial<T>;
  layout: FormField<T>[][];
  validateOn?: FormFieldValidation;
  validateOnInit?: boolean;
  onChange<T>(data: Partial<T>): void;
};

export function GenericForm<T>({ initialData={}, layout, validateOn = 'submit', validateOnInit = false, onChange }: FormProps<T>) {
  // Transform undefined values into null (necessary for safe react updates)
  const processedInitialData: Record<string, unknown> = {
    ...initialData
  }
  for(let key of Object.keys(processedInitialData)) {
    if(processedInitialData[key] === undefined) {
     // processedInitialData[key] = null;
    }
  }

  // States
  const [didInit, setDidInit] = useState<boolean>(false);
  const [formData, setFormData] = useState<Record<string, unknown>>({...processedInitialData});
  const [changedFields, setChangedFields] = useState<string[]>([]);
  const [validationState, setValidationState] = useState<Record<string, boolean | string>>({});
  const allFields = Object.keys(initialData);

  // Update form data
  function updateValue<T>(field: FormField<T>, newValue: T) {
    if(allFields.indexOf(field.key) == -1) {
      throw Error(`
        GenericForm: attempted to set field ${field.key} in generic T which may not have this member.
        Make sure the initialData contains all the same members as the layout prop!
      `);
      return;
    } 
    setFormData({
      ...formData,
      [field.key]: newValue,
    });
    setChangedFields([...changedFields, field.key]);
  }

  // Alert parent of change
  useEffect(() => {
    if(!didInit) {
      setDidInit(true);
      if(validateOnInit) {
        setChangedFields(allFields);
      }
    }
    onChange<T>(formData as T);
  }, [formData]);

  // Update validation for given field
  useEffect(() => {
    if(validateOn === 'change' && changedFields.length > 0) {
      updateValidation(changedFields);
      setChangedFields([])
    }
  }, [changedFields])

  // Update validation state for all fields
  function updateValidation(validateKeys?: string[]) {
    let newValidation: Record<string, string | boolean> = {}
    layout.forEach(row => {
      row.forEach(field => {
        // Only validate desired list
        if (validateKeys !== null && validateKeys?.indexOf(field.key) == -1){
          return;
        }
        // Run validation
        const value = formData[field.key];
        let error: boolean | string = !isRequirementSatisfied(field);
        let validatorResult = field.validator?.(value);
        if(validatorResult === false) {
          error = true;
        } else if(validatorResult === true) {
          error = false;
        } else if (validatorResult !== undefined) {
          error = validatorResult;
        }
        // Update validations
        newValidation = {
          ...newValidation,
          [field.key]: error
        }
      })
    })
    // Rerender form with new validation state
    setValidationState({
      ...validationState,
      ...newValidation
    })
  }

  // Default requirement validation
  function isRequirementSatisfied<T>(field: FormField<T>) {
    const value = formData[field.key];
    if(field.required === true || field.required === undefined) {
      if(value === undefined || value === null || (value as string) === '') {
        return false;
      }
    }
    return true;
  }

  // Regular text input
  function makeStandardInput<T>(field: FormField<T>, type: InputFieldType) {
    return (
      <InputField<T>
        key={field.key}
        placeholder="some"
        value={(formData[field.key] ?? '') as string}
        onChange={(v: T) => updateValue<T>(field, v as T)}
        disabled={allFields.indexOf(field.key) == -1}
        error={validationState[field.key] ?? false}
        type={type}
      >
        {field.label}
      </InputField>
    );
  }

  // Make form field UI
  function makeFormField(field: FormField<T>) {
    switch (field.type) {
      case 'text':
        return makeStandardInput<string>(field, 'text');
      case 'text-long': // TODO text area
        return makeStandardInput<string>(field, 'text');
      case 'number':
        return makeStandardInput<number>(field, 'number');
    }
    return <b>FORM FIELD TYPE '{field.type}' NOT IMPLEMENTED</b>;
  }

  function makeRow(index: number, row: FormField<T>[]): Children {
    return <div key={index} style={{ display: 'flex', gap: '1em' }}>{row.map((field) => makeFormField(field))}</div>;
  }

  return (
    <div>
      <form>{layout.map((row, index) => makeRow(index, row))}</form>
      <br></br>
      <code>allFields: {JSON.stringify(allFields)}</code>
      <br></br>
      <code>errors: {JSON.stringify(validationState, null, 2)}</code>
      <br></br>
      <code>formData: {JSON.stringify(formData)}</code>
    </div>
  );
}

