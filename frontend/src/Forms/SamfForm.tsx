import classNames from 'classnames';
import { createContext, Dispatch, ReactElement, useContext, useEffect, useReducer } from 'react';
import { Button, Dropdown, InputField, TextAreaField } from '~/Components';
import { DropDownOption } from '~/Components/Dropdown/Dropdown';
import { ImagePicker } from '~/Components/ImagePicker/ImagePicker';
import { InputFieldType } from '~/Components/InputField/InputField';
import styles from './SamfForm.module.scss';

// ================================== //
//    Context & State Management      //
// ================================== //

// Action on form state
type SamfFormAction<U> = {
  field: string;
  value: U;
  error: string | boolean;
};

// Current state of form
type SamfFormModel = Record<string, unknown>;
type SamfFormState<T extends SamfFormModel> = {
  values: T;
  validity: Record<string, boolean>;
  errors: Record<string, string | boolean>;
  allFields: string[];
};

// Shared samf form context (passed to children form fields)
type SamfFormContextType<T extends SamfFormModel> = {
  state: SamfFormState<T>;
  dispatch: Dispatch<SamfFormAction<unknown>>;
};
const emptyState = { values: {}, validity: {}, errors: {} } as SamfFormState<SamfFormModel>;
const SamfFormContext = createContext<SamfFormContextType<SamfFormModel>>({
  state: emptyState,
  dispatch: () => emptyState,
});

// Samf form context for configs (currently only option to validate on init)
type SamfFormConfigContext = {
  validateOnInit: boolean;
};
const SamfFormConfigContext = createContext<SamfFormConfigContext>({
  validateOnInit: false,
});

// Samf form context for constants
const SamfFormValidateOnInitContext = createContext<boolean>(false);

/**
 * Handles form event from children input components
 * @param state Current state
 * @param action Change action to perform
 * @returns
 */
function samfFormReducer<T extends SamfFormModel, U>(
  state: SamfFormState<T>,
  action: SamfFormAction<U>,
): SamfFormState<T> {
  // Change state of a field
  return {
    ...state,
    values: {
      ...state.values,
      [action.field]: action.value,
    },
    errors: {
      ...state.errors,
      [action.field]: action.error,
    },
    allFields: Array.from(new Set(state.allFields.concat(action.field))),
  };
}

// ================================== //
//         Form Component             //
// ================================== //

// Form properties
type SamfFormProps<T> = {
  initialData?: Partial<T>;
  validateOnInit?: boolean;
  submitButton?: boolean | string;
  onChange?<T>(data: Partial<T>): void;
  onValidityChanged?(valid: boolean): void;
  onSubmit?(data: Partial<T>): void;
  children: ReactElement | ReactElement[];
  // Deb/debug mode
  devMode?: boolean;
};

export function SamfForm<T>({
  initialData = {},
  validateOnInit = false,
  submitButton = false,
  onChange,
  onValidityChanged,
  onSubmit,
  children,
  devMode = false,
}: SamfFormProps<T>) {
  // Initial state and reducer (a custom state manager)
  const initialFormState: SamfFormState<Partial<T>> = {
    values: { ...initialData },
    validity: {},
    errors: {},
    allFields: Object.keys(initialData),
  };
  const [state, dispatch] = useReducer(samfFormReducer, initialFormState);

  // Calculate if entire form is valid
  let allValid = true;
  for (let key of state.allFields) {
    const err = state.errors[key];
    if (err !== false) {
      allValid = false;
      break;
    }
  }

  // Submit values to parent
  function handleOnClickSubmit() {
    onSubmit?.(state.values as T);
  }

  // Alert parent of form value changes
  useEffect(() => {
    onChange?.(state.values as Partial<T>);
  }, [state.values]);

  // Alert parent of form error changes
  useEffect(() => {
    onValidityChanged?.(allValid);
  }, [state.errors]);

  // Debug preview, very useful to develop forms
  const devModePreview = devMode && (
    <div className={styles.debug_box}>
      <div className={styles.debug_column}>
        <h2 className={styles.debug_header}>Form State</h2>
        {Object.keys(state.values).map((field) => (
          <div key={field} className={styles.debug_row}>
            {field}: {typeof state.values[field]} = {JSON.stringify(state.values[field]) ?? 'undefined'}
          </div>
        ))}
      </div>
      <div className={styles.debug_column}>
        <h2 className={styles.debug_header}>Form Errors ({allValid ? 'valid' : 'not valid'})</h2>
        {Object.keys(state.errors).map((field) => (
          <div key={field} className={classNames(styles.debug_row, state.errors[field] != false && styles.debug_error)}>
            {field}: {JSON.stringify(state.errors[field])}
          </div>
        ))}
      </div>
      <div className={styles.debug_column}>
        <h2 className={styles.debug_header}>Form fields</h2>
        {state.allFields.map((field) => (
          <div key={field} className={styles.debug_row}>
            {field}
          </div>
        ))}
      </div>
    </div>
  );

  // Render children with form context
  return (
    <SamfFormContext.Provider value={{ state, dispatch }}>
      <SamfFormConfigContext.Provider value={{ validateOnInit }}>
        <form className={styles.samf_form}>
          {children}
          {submitButton && (
            <Button
              preventDefault={true}
              type="submit"
              theme="green"
              rounded={true}
              onClick={handleOnClickSubmit}
              disabled={!allValid}
            >
              {submitButton !== true ? submitButton : 'Lagre'}
            </Button>
          )}
        </form>
        {devModePreview}
      </SamfFormConfigContext.Provider>
    </SamfFormContext.Provider>
  );
}

// ================================== //
//        Form Field Component        //
// ================================== //

/**
 * Hook for samfFormField. Wraps context and useful logic in a separate hook.
 * @param type The field type to use, eg text, number, image etc.
 * @param required Whether or not the field is required
 * @param validator Optional additional validator for the field. Returns error message or false for error, true or undefined for OK
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
    if(newValue !== undefined && validator !== undefined) {
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
type SamfFormFieldType = 'text' | 'text-long' | 'float' | 'integer' | 'number' | 'options' | 'image' | 'datetime';
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
  const errorBoolean = error === false || error == undefined ? false : true;

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
  function handleOnChange(newValue: any, skipValidation?: boolean) {
    // Cast types (eg number inputs might initially be strings)
    // This should likely be moved to each input component
    switch (type) {
      case 'number':
        newValue = numberCaster(newValue);
        break;
      case 'float':
        newValue = numberCaster(newValue);
        break;
      case 'integer':
        newValue = numberCaster(newValue);
        break;
      case 'text':
        newValue = stringCaster(newValue);
        break;
      case 'text-long':
        newValue = stringCaster(newValue);
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
  }, [validateOnInit]);

  // Set value in context on first render
  useEffect(() => {
    handleOnChange(value, !validateOnInit);
  }, []);

  // ================================== //
  //           Form Field UI            //
  // ================================== //

  // Regular input for text, numbers, dates
  function makeStandardInput(type: InputFieldType) {
    return (
      <InputField<U>
        key={field}
        value={value as string}
        onChange={handleOnChange}
        error={error}
        type={type}
        className={styles.input_element}
      >
        {label}
      </InputField>
    );
  }

  // Long text input for descriptions etc
  function makeAreaInput() {
    return (
      <TextAreaField
        key={field}
        value={value as string}
        onChange={handleOnChange}
        error={error}
        className={styles.input_element}
      >
        {label}
      </TextAreaField>
    );
  }

  // Options dropdown input
  function makeOptionsInput() {
    return (
      <Dropdown<U>
        key={field}
        defaultValue={defaultOption}
        options={options}
        onChange={handleOnChange}
        label={label}
        error={errorBoolean}
        className={styles.input_element}
      />
    );
  }

  // Image picker
  function makeImagePicker() {
    return <ImagePicker key={field} onSelected={handleOnChange} />;
  }

  // Generate UI based on type
  function makeFormField() {
    switch (type) {
      case 'text':
        return makeStandardInput('text');
      case 'text-long':
        return makeAreaInput();
      case 'datetime':
        return makeStandardInput('datetime-local');
      case 'number':
      case 'integer':
      case 'float':
        return makeStandardInput('number');
      case 'options':
        return makeOptionsInput();
      case 'image':
        return makeImagePicker();
    }
    return <b style={{ color: 'red' }}>Field type '{type}' is not implemented!</b>;
  }

  return makeFormField();
}
