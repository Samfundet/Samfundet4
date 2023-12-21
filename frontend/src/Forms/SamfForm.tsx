import classNames from 'classnames';
import { createContext, Dispatch, ReactNode, useEffect, useReducer, useState } from 'react';
import { Button } from '~/Components';
import { usePermission } from '~/hooks';
import { PERM } from '~/permissions';
import styles from './SamfForm.module.scss';

// ================================== //
//    Context & State Management      //
// ================================== //

// Action on form state
type SamfFormAction<U> = {
  field: string;
  value?: U;
  error: string | boolean;
};

// Current state of form
type SamfFormModel = Record<string, unknown>;
type SamfFormState<T extends SamfFormModel> = {
  values: T;
  validity: Record<string, boolean>;
  errors: Record<string, string | boolean>;
  allFields: string[];
  didSubmit: boolean;
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

// Validation mode (when to show validation errors)
type ValidationMode = 'submit' | 'change';

// Samf form context for configs (currently only option to validate on init)
type SamfFormConfigContext = {
  validateOnInit: boolean;
  validateOn: ValidationMode;
};
export const SamfFormConfigContext = createContext<SamfFormConfigContext>({
  validateOnInit: false,
  validateOn: 'change',
});

/**
 * Handles form event from children input components
 * @param state Current state
 * @param action Change action to perform
 * @returns
 */
function samfFormReducer<T extends SamfFormModel, U>(
  state: SamfFormState<T>,
  action: SamfFormAction<U> | 'submit',
): SamfFormState<T> {
  // Submit action
  if (action === 'submit') {
    return {
      ...state,
      didSubmit: true,
    };
  }
  // Change state of a field
  let newState = { ...state, allFields: Array.from(new Set(state.allFields.concat(action.field))) };
  if (action.value) {
    newState = {
      ...newState,
      values: {
        ...state.values,
        [action.field]: action.value,
      },
      errors: {
        ...state.errors,
        [action.field]: action.error,
      },
    };
  }
  if (action.error) {
    newState = {
      ...newState,
      errors: {
        ...state.errors,
        [action.field]: action.error,
      },
    };
  }
  return newState;
}

// ================================== //
//         Form Component             //
// ================================== //

// Form properties
type SamfFormProps<T> = {
  initialData?: Partial<T>;
  validateOnInit?: boolean;
  validateOn?: ValidationMode;
  submitText?: string;
  noStyle?: boolean;
  className?: string;
  onChange?<T>(data: Partial<T>): void;
  onValidityChanged?(valid: boolean): void;
  onSubmit?(data: Partial<T>): void;
  children: ReactNode;
  devMode?: boolean; // Dev/debug mode.
  externalErrors?: object;
  isDisabled?: boolean; // If true, disables submit button
};

export function SamfForm<T>({
  initialData = {},
  validateOnInit = false,
  validateOn = 'submit',
  submitText,
  noStyle,
  className,
  onChange,
  onValidityChanged,
  onSubmit,
  externalErrors,
  children,
  devMode = false,
  isDisabled = false,
}: SamfFormProps<T>) {
  // Initial state and reducer (a custom state manager)
  const initialFormState: SamfFormState<Partial<T>> = {
    values: { ...initialData },
    validity: {},
    errors: {},
    allFields: Object.keys(initialData),
    didSubmit: false,
  };
  const [state, dispatch] = useReducer(samfFormReducer, initialFormState);
  const canDebug = usePermission(PERM.SAMFUNDET_DEBUG);
  const [isDebugMode, setIsDebugMode] = useState(devMode);
  const showDevMode = isDebugMode && canDebug;

  // Animated wiggle on failed
  const [animateError, setAnimateError] = useState<boolean>(false);

  // Calculate if entire form is valid
  let allValid = true;
  for (const key of state.allFields) {
    const err = state.errors[key];
    if (err !== false) {
      allValid = false;
      break;
    }
  }

  useEffect(() => {
    if (externalErrors) {
      for (const [field, errors] of Object.entries(externalErrors)) {
        const newError = typeof errors === 'string' ? errors : errors.join('\n');
        dispatch({ field: field, error: newError } as SamfFormAction<string>);
      }
    }
  }, [externalErrors]);

  // Submit values to parent
  function handleOnClickSubmit(e?: React.MouseEvent<HTMLElement>) {
    e?.preventDefault();
    // If validate on submit and not all valid, set submit state
    // to make fields show error and return
    if (validateOn === 'submit' && !allValid) {
      setAnimateError(true);
      dispatch('submit');
      return;
    }
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
  const devModePreview = showDevMode && (
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

  // Disable submit button when validating on change
  const disableSubmit = isDisabled || (validateOn === 'change' && !allValid);

  const formClass = noStyle ? className : classNames(styles.samf_form, animateError && styles.animate_error, className);

  // Render children with form context
  return (
    <SamfFormContext.Provider value={{ state, dispatch }}>
      <SamfFormConfigContext.Provider value={{ validateOnInit, validateOn }}>
        <form className={formClass} onAnimationEnd={() => setAnimateError(false)}>
          {children}
          {onSubmit !== undefined && (
            <div className={styles.submit_row}>
              <Button
                preventDefault={true}
                type="submit"
                theme="green"
                rounded={true}
                onClick={handleOnClickSubmit}
                disabled={disableSubmit}
              >
                {submitText !== undefined ? submitText : 'Lagre'}
              </Button>
            </div>
          )}
          {canDebug && (
            <>
              <br></br>
              <Button preventDefault={true} display="pill" onClick={() => setIsDebugMode(!isDebugMode)}>
                Debug
              </Button>
            </>
          )}
        </form>
        {devModePreview}
      </SamfFormConfigContext.Provider>
    </SamfFormContext.Provider>
  );
}
