import classNames from 'classnames';
import { createContext, Dispatch, ReactElement, useContext, useEffect, useReducer } from 'react';
import { Dropdown, InputField, TextAreaField } from '~/Components';
import { DropDownOption } from '~/Components/Dropdown/Dropdown';
import { ImagePicker } from '~/Components/ImagePicker/ImagePicker';
import { InputFieldType } from '~/Components/InputField/InputField';
import styles from './GenericForm.module.scss';

type FormFieldType = 'text' | 'text-long' | 'number' | 'datetime' | 'options' | 'image';
type FormFieldValidation = 'submit' | 'change';

// ================================== //
//         State Management           //
// ================================== //

// Actions on form reducer
type SamfFormAction<U> = {
  field: string;
  value: U;
  error: string | boolean;
};

// State of form
type SamfFormModel = Record<string, unknown>;
type SamfFormState<T extends SamfFormModel> = {
  values: T;
  validity: Record<string, boolean>;
  errors: Record<string, string | boolean>;
  allFields: string[];
};

// Global samf form context (for state)
type SamfFormContextType<T extends SamfFormModel> = {
  state: SamfFormState<T>;
  dispatch: Dispatch<SamfFormAction<unknown>>;
};
const emptyState = { values: {}, validity: {}, errors: {} } as SamfFormState<SamfFormModel>;
const SamfFormContext = createContext<SamfFormContextType<SamfFormModel>>({
  state: emptyState,
  dispatch: () => emptyState
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
    allFields: Array.from(new Set(state.allFields.concat(action.field)))
  };
}

// ================================== //
//         Form Component             //
// ================================== //

type SamfFormProps<T> = {
  initialData?: Partial<T>;
  validateOn?: FormFieldValidation;
  validateOnInit?: boolean;
  showSubmitButton?: boolean;
  onChange<T>(data: Partial<T>): void;
  onValidityChanged?(valid: boolean): void;
  onSubmit?(data: Partial<T>): void;
  children: ReactElement | ReactElement[];
  // Debug mode
  devMode?: boolean;
};

export function SamfForm<T>({
  initialData = {},
  validateOn = 'submit',
  validateOnInit = false,
  showSubmitButton = true,
  onChange,
  onValidityChanged,
  onSubmit,
  children,
  devMode = false,
}: SamfFormProps<T>) {
  
  const initialFormState: SamfFormState<Partial<T>> = {
    values: { ...initialData },
    validity: {},
    errors: {},
    allFields: Object.keys(initialData)
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

  // Form values changed
  useEffect(() => {
    onChange(state.values as Partial<T>);
  }, [onChange, state.values]);

  // Form validity changed
  useEffect(() => {
    onValidityChanged?.(allValid);
  }, [onValidityChanged, state.errors]);

  // Debug preview, very useful to develop forms
  const devModePreview = devMode && (
    <div className={styles.debug_box}>
      <div className={styles.debug_column}>
        <h2 className={styles.debug_header}>Form State</h2>
        {Object.keys(state.values).map(field => (
          <div className={styles.debug_row}>
            {field}: {typeof state.values[field]} = {JSON.stringify(state.values[field]) ?? 'undefined'}
          </div>
        ))}
      </div>
      <div className={styles.debug_column}>
        <h2 className={styles.debug_header}>Form Errors ({allValid ? 'valid' : 'not valid'})</h2>
        {Object.keys(state.errors).map(field => (
          <div className={classNames(styles.debug_row, state.errors[field] != false && styles.debug_error)}>
            {field}: {JSON.stringify(state.errors[field])}
          </div>
        ))}
      </div>
      <div className={styles.debug_column}>
        <h2 className={styles.debug_header}>Form fields</h2>
        {state.allFields.map(field => (
          <div className={styles.debug_row}>{field}</div>
        ))}
      </div>
    </div>
  );

  // Render children with form context
  return (
    <SamfFormContext.Provider value={{ state, dispatch }}>
      <SamfFormValidateOnInitContext.Provider value={validateOnInit}>
        <form>{children}</form>
        {devModePreview}
      </SamfFormValidateOnInitContext.Provider>
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
    const validatorResponse = validator?.(newValue) ?? true;
    const failedRequirement = required && newValue === undefined;
    const isError = failedRequirement || validatorResponse !== true;
    // Error state based on validation
    let errorState: string | boolean = isError;
    if (validatorResponse !== true && validatorResponse !== undefined) {
      errorState = validatorResponse;
    }
    // Skipping validation
    if(skipValidation === true) {
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
type SamfFormFieldType = 'text' | 'text-long' | 'float' | 'integer' | 'number' | 'options' | 'image';
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
  const validateOnInit = useContext(SamfFormValidateOnInitContext);
  
  // State (from context hook)
  const { value, error, setValue } = useSamfFormInput<U>(field, required, validator);
  const errorBoolean = error === false || error == undefined ? false : true;

  // Casts a string to an integer (undefined if NaN)
  function numberCaster(v: string): U | undefined {
    const num = type === 'integer' ? Number.parseInt(v) : Number.parseFloat(v);
    if (isNaN(num)) {
      return undefined;
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
      case 'float':
      case 'integer':
        newValue = numberCaster(newValue);
        break;
      case 'text':
      case 'text-long':
        newValue = stringCaster(newValue);
        break;
    }
    // Set value in samf form hook
    setValue(newValue as U, skipValidation);
  }

  // Validate on init (first render)
  useEffect(() => {
    if (validateOnInit) {
      handleOnChange(value);
    }
  }, [validateOnInit]);

  // Set value in context on first render
  useEffect(() => {
    handleOnChange(value);
  }, []);

  // ================================== //
  //           Form Field UI            //
  // ================================== //

  // Regular text input for text, numbers, dates
  function makeStandardInput(type: InputFieldType) {
    return (
      <InputField<U> key={field} value={(value ?? '') as string} onChange={handleOnChange} error={error} type={type}>
        {label}
      </InputField>
    );
  }

  // Long text input for descriptions etc
  function makeAreaInput() {
    return (
      <TextAreaField key={field} value={value as string} onChange={handleOnChange} error={error}>
        {label}
      </TextAreaField>
    );
  }

  // Long text input for descriptions etc
  function makeOptionsInput() {
    return (
      <Dropdown<U>
        key={field}
        defaultValue={defaultOption}
        options={options}
        onChange={handleOnChange}
        label={label}
        error={errorBoolean}
      />
    );
  }

  // Image picker
  function makeImagePicker() {
    return <ImagePicker key={field} onSelected={handleOnChange} />;
  }

  // Generate input based on type
  function makeFormField() {
    switch (type) {
      case 'text':
        return makeStandardInput('text');
      case 'text-long':
        return makeAreaInput();
      //case 'datetime':
      //  return makeStandardInput<string>(field as FormField<string>, 'datetime-local');
      case 'number':
      case 'integer':
      case 'float':
        return makeStandardInput('number');
      case 'options':
        return makeOptionsInput();
      case 'image':
        return makeImagePicker();
    }
    return <b>FORM FIELD TYPE {type} NOT IMPLEMENTED</b>;
  }

  return (
    <div>
      {makeFormField()}
    </div>
  );
}
