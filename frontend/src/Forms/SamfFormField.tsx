import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DropDownOption } from '~/Components/Dropdown/Dropdown';
import { KEY } from '~/i18n/constants';
import { SamfFormConfigContext, SamfFormContext } from './SamfForm';
import { FieldProps, SamfFormFieldArgs, SamfFormFieldType, SamfFormFieldTypeMap } from './SamfFormFieldTypes';

// ================================== //
//             Utilities              //
// ================================== //

/**
 * Calculates the error state for a given value
 * @param value Current value of the field
 * @param required Whether the field is required
 * @param validator Optional validation function
 * @returns error state (true/false or error message string)
 */
function getErrorState<U>(value: U, required?: boolean, validator?: (v: U) => string | boolean) {
  // Missing value but field is required
  if (required === true && (value === undefined || value === '')) {
    return true;
  }
  // Run custom validation check
  const validationResult = validator?.(value);
  // No error for validator
  if (validationResult === undefined || validationResult === true) {
    return false;
  }
  // Error for validator
  if (validationResult === false) {
    return true;
  }
  // Error message from validator
  return validationResult;
}

/**
 * Casts a string value to a number
 * @param value string value
 * @param int cast as int
 * @returns number value
 */
function castNumber(value: string, int: boolean): number | undefined {
  const num = int ? Number.parseInt(value) : Number.parseFloat(value);
  if (isNaN(num)) {
    return undefined;
  }
  return num;
}

// ================================== //
//        Form Field Component        //
// ================================== //

/**
 * Hook for samfFormField. Wraps context and useful logic in a separate hook.
 * @param type The field type to use, eg text, number, image etc.
 * @param required Whether or not the field is required
 * @param validator Optional additional validator function for the field
 * @returns hook for value, state and setValue
 */
function useSamfForm<U>(field: string, required: boolean, validator?: (v: U) => string | boolean) {
  // Get the context provided by SamfForm
  const { state, dispatch } = useContext(SamfFormContext);
  if (state === undefined || dispatch === undefined) {
    throw new Error('SamfFormField must be used inside a SamfForm (the context provider)');
  }

  // Set the current value of the state using form context
  function setValue(newValue: U) {
    // Dispatch event to form reducer
    dispatch?.({
      field: field,
      value: newValue,
      error: getErrorState(newValue, required, validator),
    });
  }

  // Return state to render and update function
  const value = state.values[field] as U;
  const error = state.errors[field];
  const didSubmit = state.didSubmit;
  return { value, error, didSubmit, setValue };
}

// SamfFormField properties
type SamfFormFieldProps<U> = {
  // General
  field: string;
  type: SamfFormFieldType;
  required?: boolean;
  label?: string;
  hidden?: boolean;
  validator?: (v: U) => string | boolean;
  // Dropdown
  options?: DropDownOption<U>[];
  defaultOption?: DropDownOption<U>;
  onChange?: (value: U) => void;
  props?: FieldProps;
};
export function SamfFormField<U>({
  field,
  type,
  required = true,
  hidden = false,
  label,
  options,
  defaultOption,
  validator,
  onChange,
  props,
}: SamfFormFieldProps<U>) {
  // Validate on init context
  const { validateOnInit, validateOn } = useContext(SamfFormConfigContext);
  const { t } = useTranslation();

  // Value state (from context hook)
  const { value, error, didSubmit, setValue } = useSamfForm<U>(field, required, validator);

  // Whether or not to show error for field
  // Toggeled on submit or on field change
  const [showError, setShowError] = useState<boolean>(validateOnInit);

  // Handles all change events
  function handleOnChange(newValue: unknown, initialUpdate?: boolean) {
    onChange?.(newValue as U);
    // Cast types (eg number inputs might initially be strings)
    if (type === 'number' || type === 'float') {
      newValue = castNumber(newValue as string, false);
    }
    if (type === 'integer') {
      newValue = castNumber(newValue as string, true);
    }
    // Set value using samf form hook
    setValue(newValue as U);
    // Validate on change, enable display error
    if (validateOn === 'change' && initialUpdate !== true) {
      setShowError(true);
    }
    onChange && onChange(newValue as U);
  }

  // Enable show error for validate on submit
  useEffect(() => {
    setShowError(true);
  }, [didSubmit]);

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
    handleOnChange(value, true);
    // Handle on change depends on field type which should never change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Change validity on requirement changed
  // Set value in context on first render (not critical to run every dep change)
  useEffect(() => {
    handleOnChange(value, false);
    // Handle on change depends on field type which should never change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [required]);

  // ================================== //
  //           Form Field UI            //
  // ================================== //

  // Generate UI based on type
  function makeFormField() {
    let errorMsg = required && !value ? t(KEY.common_required) : error;
    errorMsg = error ? errorMsg : false;
    const args: SamfFormFieldArgs = {
      // Standard args
      field: field,
      value: value,
      onChange: handleOnChange,
      error: showError ? errorMsg : false,
      label: label,
      // Options args
      options: options,
      defaultOption: defaultOption,
      props: props,
    };
    const generatorFunction = SamfFormFieldTypeMap[type];
    return generatorFunction?.(args) ?? <></>;
  }

  return (
    <>
      {hidden && <div style={{ display: 'none' }}>{makeFormField()}</div>}
      {!hidden && makeFormField()}
    </>
  );
}
