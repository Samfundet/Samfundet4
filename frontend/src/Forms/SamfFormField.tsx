import { useContext, useEffect } from 'react';
import { DropDownOption } from '~/Components/Dropdown/Dropdown';
import { SamfFormConfigContext, SamfFormContext } from './SamfForm';
import { SamfFormFieldArgs, SamfFormFieldType, SamfFormFieldTypeMap } from './SamfFormFieldTypes';

// ================================== //
//        Form Field Component        //
// ================================== //

/**
 * Hook for samfFormField. Wraps context and useful logic in a separate hook.
 * @param type The field type to use, eg text, number, image etc.
 * @param required Whether or not the field is required
 * @param validator Optional additional validator function for the field
 * @returns
 */
function useSamfFormInput<U>(field: string, required: boolean, validator?: (v: U) => string | boolean) {
  // Get the context provided by SamfForm
  const { state, dispatch } = useContext(SamfFormContext);
  if (state === undefined || dispatch === undefined) {
    throw new Error('SamfFormField must be used inside a SamfForm (the context provider)');
  }

  // Set the current value of the state using form context
  function setValue(newValue: U, skipValidation?: boolean) {
    // Validation check
    let validatorResponse: string | boolean = true;
    if (newValue !== undefined && validator !== undefined) {
      validatorResponse = validator?.(newValue);
    }
    const failedRequirement = required && newValue === undefined;
    const isError = failedRequirement || validatorResponse !== true;
    // Error state based on validation
    let errorState: string | boolean = isError;
    if (validatorResponse !== true && validatorResponse !== undefined) {
      errorState = validatorResponse;
    }
    // Skipping validation
    if (skipValidation === true) {
      errorState = state.errors[field];
    }
    // Dispatch event to form reducer
    dispatch?.({
      field: field,
      value: newValue,
      error: errorState,
    });
  }

  // Return state to render and update function
  const value = state.values[field] as U;
  const error = state.errors[field];
  return { value, error, setValue };
}

// SamfFormField properties
type SamfFormFieldProps<U> = {
  // General
  field: string;
  type: SamfFormFieldType;
  required?: boolean;
  label?: string;
  validator?: (v: U) => string | boolean;
  // Dropdown
  options?: DropDownOption<U>[];
  defaultOption?: DropDownOption<U>;
};

export function SamfFormField<U>({
  field,
  type,
  required = true,
  label,
  options,
  defaultOption,
  validator,
}: SamfFormFieldProps<U>) {
  // Validate on init context
  const { validateOnInit } = useContext(SamfFormConfigContext);

  // State (from context hook)
  const { value, error, setValue } = useSamfFormInput<U>(field, required, validator);

  // Casts a string to an integer (undefined if NaN)
  function numberCaster(v: string): U | undefined {
    const num = type === 'integer' ? Number.parseInt(v) : Number.parseFloat(v);
    if (isNaN(num)) {
      // TODO need to handle typing of commas etc. which are temporarily NaNs
      return v as U;
    }
    return num as U;
  }

  // Casts an empty string to undefined
  function stringCaster(v: string): U | undefined {
    if (required && v === '') {
      return undefined;
    }
    return v as U;
  }

  // Handles all change events
  function handleOnChange(newValue: unknown, skipValidation?: boolean) {
    // Cast types (eg number inputs might initially be strings)
    // This should likely be moved to each input component
    switch (type) {
      case 'number':
        newValue = numberCaster(newValue as string);
        break;
      case 'float':
        newValue = numberCaster(newValue as string);
        break;
      case 'integer':
        newValue = numberCaster(newValue as string);
        break;
      case 'text':
        newValue = stringCaster(newValue as string);
        break;
      case 'text-long':
        newValue = stringCaster(newValue as string);
        break;
    }
    // Set value in samf form hook
    setValue(newValue as U, skipValidation);
  }

  // Validate again whenever validateOnInit is turned on
  useEffect(() => {
    if (validateOnInit) {
      handleOnChange(value, false);
    }
    // Handle on change depends on field type which should never change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [validateOnInit]);

  // Set value in context on first render (not critical to run every dep change)
  useEffect(() => {
    handleOnChange(value, !validateOnInit);
    // Handle on change depends on field type which should never change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ================================== //
  //           Form Field UI            //
  // ================================== //

  // Generate UI based on type
  function makeFormField() {
    const args: SamfFormFieldArgs = {
      // Standard args
      field: field,
      value: value,
      onChange: handleOnChange,
      error: error,
      label: label,
      // Options args
      options: options,
      defaultOption: defaultOption,
    };
    const generatorFunction = SamfFormFieldTypeMap[type];
    return generatorFunction?.(args) ?? <></>;
  }

  return makeFormField();
}
