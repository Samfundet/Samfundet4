import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DropDownOption } from '~/Components/Dropdown/Dropdown';
import { KEY } from '~/i18n/constants';
import {
  FormType,
  SamfError,
  SamfFormActionType,
  SamfFormConfigContext,
  SamfFormContext,
  SamfFormContextType,
} from './SamfForm';
import {
  FieldProps,
  GeneratorFunction,
  SamfFormFieldArgs,
  SamfFormFieldType,
  SamfFormGenrators,
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
  options?: DropDownOption<unknown>[];
  defaultOption?: DropDownOption<unknown>;
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
      if (!(!validateOnInit && isInit)) {
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
    // Update value, error and didSubmit locally
    setLocalValue(newValue as U);
    //setError(newError);
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

  // ---------------------------------- //
  //              Handlers              //
  // ---------------------------------- //
  function handleOnChange(newValue: U) {
    setIsInit(false);
    // Set value using form hook
    setValue(newValue);
    // Notify parrent component of change
    onChange && onChange(newValue);
  }

  // When form is submitted, trigger an update in this field
  useEffect(() => {
    if (state.didSubmit) {
      setIsInit(false);
      setValue(localValue, 'submit');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.didSubmit]);

  // Display current error when isInit is disabled
  useEffect(() => {
    if (!isInit) {
      const newError: SamfError = getErrorState(localValue, state.values, required, validator, t(KEY.common_required));
      setDisplayError(newError);
    }
  }, [isInit]);

  // Update error on any change in the form
  useEffect(() => {
    setValue(localValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.values, localValue, required, validator]);

  // Trigger init on first render
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
    const generatorFunction: GeneratorFunction<U> = SamfFormGenrators[type];
    return generatorFunction(args);
  }

  return (
    <>
      {hidden && <div style={{ display: 'none' }}>{makeFormField()}</div>}
      {!hidden && makeFormField()}
    </>
  );
}
