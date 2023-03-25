import classNames from 'classnames';
import { createContext, Dispatch, ReactNode, useEffect, useReducer } from 'react';
import { Button } from '~/Components';
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
export const SamfFormContext = createContext<SamfFormContextType<SamfFormModel>>({
  state: emptyState,
  dispatch: () => emptyState,
});

// Samf form context for configs (currently only option to validate on init)
type SamfFormConfigContext = {
  validateOnInit: boolean;
};
export const SamfFormConfigContext = createContext<SamfFormConfigContext>({
  validateOnInit: false,
});

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
  submitText?: string;
  onChange?<T>(data: Partial<T>): void;
  onValidityChanged?(valid: boolean): void;
  onSubmit?(data: Partial<T>): void;
  children: ReactNode;
  // Deb/debug mode
  devMode?: boolean;
};

export function SamfForm<T>({
  initialData = {},
  validateOnInit = false,
  submitText,
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
  for (const key of state.allFields) {
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
    // Depends on onChange function which should never change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.values]);

  // Alert parent of form error changes
  useEffect(() => {
    onValidityChanged?.(allValid);
    // Depends on onValidityChanged function which should never change
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          {onSubmit !== undefined && (
            <div className={styles.submit_row}>
              <Button
                preventDefault={true}
                type="submit"
                theme="green"
                rounded={true}
                onClick={handleOnClickSubmit}
                disabled={!allValid}
              >
                {submitText !== undefined ? submitText : 'Lagre'}
              </Button>
            </div>
          )}
        </form>
        {devModePreview}
      </SamfFormConfigContext.Provider>
    </SamfFormContext.Provider>
  );
}
