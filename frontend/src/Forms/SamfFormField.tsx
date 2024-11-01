import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { DropdownOption } from '~/Components/Dropdown/Dropdown';
import { KEY } from '~/i18n/constants';
import {
  type FormType,
  type SamfError,
  type SamfFormActionType,
  SamfFormConfigContext,
  SamfFormContext,
  type SamfFormContextType,
} from './SamfForm';
import {
  type FieldProps,
  type GeneratorFunction,
  type SamfFormFieldArgs,
  type SamfFormFieldType,
  SamfFormGenerators,
} from './SamfFormFieldTypes';

// ---------------------------------- //
//             Utilities              //
// ---------------------------------- //
/**
 * Calculates the error state for a given value.
 *
 * @param value Current value of the field
 * @param required Whether the field is required
 * @param validator Optional validation function
 * @returns error state (true/false or error message string)
 * @param U Type of the SamfFormField value
 * @param T Type of the SamfForm values
 */
function getErrorState<U extends T[keyof T], T>(
  value: U,
  values: T,
  required?: boolean,
  validator?: (state: T) => SamfError,
  required_message?: string,
) {
  // Missing value but field is required
  if (required === true && (value === undefined || value === '')) {
    const errorMsg = required_message ? required_message : true;
    return errorMsg;
  }
  // Run custom validation check
  const validationResult = validator?.(values);
  // No error for validator
  if (validationResult === undefined || validationResult === true) {
    return false;
  }
  // Validator error without message
  if (validationResult === false) {
    return true;
  }
  // Validator error with message
  return validationResult;
}

/**
 * SamfFormField properties.
 *
 * @param U Type of the SamfFormField value
 * @param T Type of the SamfForm values
 */
export type SamfFormFieldProps<U extends T[keyof T], T extends FormType> = {
  // General
  type: SamfFormFieldType;
  field: keyof T; // The property of T to bind the field to
  required?: boolean;
  label?: string;
  hidden?: boolean;
  validator?: (state: T) => SamfError;
  // Dropdown
  options?: DropdownOption<unknown>[];
  defaultOption?: DropdownOption<unknown>;
  onChange?: (value: U) => void;
  props?: FieldProps;
};

/**
 * SamfFormField component. Only to be used inside a SamfForm. Note the state and dispatch props is
 * provided by the SamfForm element and should not be passed in manually.
 *
 * @param U Return type of the form field
 * @param T Type of the form values
 * @see SamfFormFieldProps
 */
export function SamfFormField<U extends T[keyof T], T extends FormType>({
  type,
  field,
  required = false,
  hidden = false,
  label,
  options,
  defaultOption,
  validator,
  onChange,
  props,
}: SamfFormFieldProps<U, T>) {
  // ---------------------------------- //
  //               Context              //
  // ---------------------------------- //
  function setValue(newValue: U, actionType: SamfFormActionType | 'init' = 'change') {
    if (state === undefined || dispatch === undefined) {
      throw new Error('SamfFormField must be used inside a SamfForm (the context provider)');
    }
    const newValues: T = { ...state.values, [field]: newValue };
    const newError: SamfError = getErrorState(newValue, newValues, required, validator, t(KEY.common_required));
    if (actionType === validateOn) {
      if (validateOnInit || !isInit) {
        setDisplayError(newError);
      }
    } else if (actionType === 'init' && validateOnInit) {
      setDisplayError(newError);
    }

    // Dispatch event to form reducer
    dispatch?.({
      type: 'field',
      field: field,
      value: newValue,
      error: newError,
    });
    // Update local value
    setLocalValue(newValue);
    setLocalError(newError);
  }

  // ---------------------------------- //
  //               Hooks                //
  // ---------------------------------- //
  const { state, dispatch } = useContext(SamfFormContext) as SamfFormContextType<T>;
  const { t } = useTranslation();
  const { validateOn, validateOnInit } = useContext(SamfFormConfigContext);

  const [isInit, setIsInit] = useState<boolean>(true);
  const [displayError, setDisplayError] = useState<SamfError>(false);
  const [localValue, setLocalValue] = useState<U>(state.values[field] as U);
  const [localError, setLocalError] = useState<SamfError>(false);

  // ---------------------------------- //
  //              Handlers              //
  // ---------------------------------- //
  function handleOnChange(newValue: U) {
    setIsInit(false);
    // Set value using form hook
    setValue(newValue);
    // Notify parrent component of change
    onChange?.(newValue);
  }

  // When form is submitted, trigger an update in this field
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (state.didSubmit) {
      setIsInit(false);
      setValue(localValue, 'submit');
    }
  }, [state.didSubmit]);

  // Display current error when isInit is disabled
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!isInit) {
      setDisplayError(localError);
    }
  }, [isInit]);

  // Update error on any change in the form
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    setValue(localValue);
  }, [state.values, localValue, required, validator]);

  // Trigger init on first render
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    setValue(localValue, 'init');
  }, []);

  // ---------------------------------- //
  //               Render               //
  // ---------------------------------- //

  // Generate UI based on type
  function makeFormField() {
    const args: SamfFormFieldArgs<U> = {
      // Standard args
      value: localValue,
      onChange: handleOnChange,
      error: displayError,
      label: label,
      // Options args
      options: options,
      defaultOption: defaultOption,
      props: props,
    };
    const generatorFunction: GeneratorFunction<U> = SamfFormGenerators[type];
    return generatorFunction(args);
  }

  return (
    <>
      {hidden && <div style={{ display: 'none' }}>{makeFormField()}</div>}
      {!hidden && makeFormField()}
    </>
  );
}
