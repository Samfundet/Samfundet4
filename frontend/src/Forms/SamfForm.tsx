import classNames from 'classnames';
import React, { Dispatch, ReactNode, createContext, useEffect, useMemo, useReducer, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, ButtonDisplay, ButtonTheme } from '~/Components/Button';
import { usePermission } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { PERM } from '~/permissions';
import styles from './SamfForm.module.scss';
import { FormFieldReturnType } from './SamfFormFieldTypes';

// ---------------------------------- //
//              Types                 //
// -----------------------------------//
/**
 * Defines the type of the form values. The values of the properties in this type should correspond to the
 * returntypes of the fields in the form.
 */
export interface FormType {
  [key: string]: FormFieldReturnType;
}

/**
 * Simple error object for SamfForm. True or a string is considered an error. False is considered valid.
 */
export type SamfError = string | boolean;

/**
 * Error object for all the form values.
 *
 * @param T Type of the form values
 * @see SamfError
 */
type Errors<T> = {
  [P in keyof T]: SamfError;
};

/**
 * Form state containing field values, field errors and submit state.
 *
 * @param T Type of the form values
 */
export type SamfFormState<T> = {
  values: T; // Form values
  errors: Errors<T>; // Form errors
  didSubmit: boolean;
};

// Validation mode (when to show validation errors)
export type SamfFormActionType = 'submit' | 'change';

// Form properties
export type SamfFormProps<T extends FormType> = {
  initialData?: T;
  validateOn?: SamfFormActionType;
  submitTextProp?: string; // Submit button text
  // submitButtonProps?: ButtonProps; // Submit button props
  submitButtonTheme?: ButtonTheme; // Replace with above line
  submitButtonDisplay?: ButtonDisplay; // Replace with above line
  className?: string;
  onChange?<T>(state: T): void;
  onValidityChanged?(valid: boolean): void;
  onSubmit?(data: Partial<T>): void;
  children: ReactNode;
  devMode?: boolean; // Dev/debug mode.
  isDisabled?: boolean; // Disables submit button
};

// ---------------------------------- //
//              Context               //
// -----------------------------------//
/**
 * Form reducer action. Either a field change, containing the new value and error, or a submit action.
 *
 * @param T Type of the form values
 */
export type SamfFormAction<T> =
  | {
      type: 'field'; // Field change
      field: keyof T; // Field refrence
      value: T[keyof T]; // New value
      error: SamfError; // New error
    }
  | {
      type: 'submit'; // Submit action
    };

/**
 * Handles form event from children input components
 *
 * @param state Current state
 * @param action Change action to perform. Either a new state or 'submit'
 * @returns New state
 */
function formReducer<T>(state: SamfFormState<T>, action: SamfFormAction<T>): SamfFormState<T> {
  switch (action.type) {
    case 'submit': {
      // Submit action
      return {
        ...state,
        didSubmit: true,
      } as SamfFormState<T>;
    }
    case 'field': {
      // Change state of a field
      const newState = { ...state } as SamfFormState<T>;

      // Reset didSubmit
      newState.didSubmit = false;

      // Update field value and error
      const field = action.field;
      newState.values[field] = action.value;
      newState.errors[field] = action.error;

      return newState;
    }
    default: {
      // TODO: maybe throw an error here?
      return state;
    }
  }
}

function useFormReducer<T>(initialData: T | undefined): [SamfFormState<T>, Dispatch<SamfFormAction<T>>] {
  const initialState = {
    values: (initialData || {}) as T,
    errors: {} as Errors<T>,
    didSubmit: false,
  } as SamfFormState<T>;
  return useReducer(formReducer<T>, initialState);
}

// Samf form context for state and dispatch
export type SamfFormContextType<T> = {
  state: SamfFormState<T>;
  dispatch: Dispatch<SamfFormAction<T>>;
};
export const SamfFormContext = createContext<SamfFormContextType<unknown>>({
  state: {} as SamfFormState<unknown>,
  dispatch: (() => {}) as Dispatch<SamfFormAction<unknown>>,
});

// Samf form context for configs (currently only option to validate on init)
type SamfFormConfigContextType = {
  validateOn: SamfFormActionType;
};
export const SamfFormConfigContext = createContext<SamfFormConfigContextType>({
  validateOn: 'change',
});

// ---------------------------------- //
//              Component             //
// -----------------------------------//
export function SamfForm<T extends FormType>({
  initialData,
  validateOn = 'change',
  submitTextProp,
  submitButtonTheme = 'green',
  submitButtonDisplay = 'basic',
  className,
  onChange,
  onValidityChanged,
  onSubmit,
  children,
  devMode = false,
  isDisabled = false,
}: SamfFormProps<T>) {
  // ---------------------------------- //
  //               Hooks                //
  // ---------------------------------- //
  const { t } = useTranslation();
  const [state, dispatch] = useFormReducer<T>(initialData);
  const [animateError, setAnimateError] = useState<boolean>(false);

  // memos
  const submitText = useMemo(() => submitTextProp ?? t(KEY.common_send), [submitTextProp, t]);
  const allValid = Object.values(state.errors).every((v) => v === false);
  const disableSubmit = isDisabled || (validateOn === 'change' && !allValid);
  // const disableSubmit: boolean = isDisabled || (validateOn === 'change' && !allValid);
  const formClass = useMemo(
    () => classNames(styles.samf_form, animateError && styles.animate_error, className),
    [animateError, className],
  );

  // Dev mode
  const canDebug = usePermission(PERM.SAMFUNDET_DEBUG);
  const [isDebugMode, setIsDebugMode] = useState(devMode);
  const showDevMode = isDebugMode && canDebug;

  // ---------------------------------- //
  //              Handlers              //
  // ---------------------------------- //
  // Submit values to parent
  function handleOnClickSubmit(e?: React.MouseEvent<HTMLElement>) {
    e?.preventDefault();
    dispatch({ type: 'submit' });
    if (allValid) {
      onSubmit?.(state.values);
    } else {
      setAnimateError(true);
    }
  }

  // ---------------------------------- //
  //               Render               //
  // ---------------------------------- //
  // Allert parent of changes in form values
  useEffect(() => {
    onChange?.(state.values as T);
  }, [state.values, onChange]);

  // Allert parent of changes in form validity
  useEffect(() => {
    onValidityChanged?.(allValid);
  }, [state.errors, allValid, onValidityChanged]);

  // Update on allValid
  useEffect(() => {
    onValidityChanged?.(allValid);
  }, [allValid, onValidityChanged]);

  // Debug preview, very useful to develop forms
  const devModePreview = showDevMode && (
    <div className={styles.debug_box}>
      <div className={styles.debug_column}>
        <h2 className={styles.debug_header}>Form State</h2>
        {Object.keys(state.values).map((field) => (
          <div key={field} className={styles.debug_row}>
            {field}: {typeof state.values[field as keyof T]} ={' '}
            {JSON.stringify(state.values[field as keyof T]) ?? 'undefined'}
          </div>
        ))}
      </div>
      <div className={styles.debug_column}>
        <h2 className={styles.debug_header}>Form Errors ({allValid ? 'valid' : 'not valid'})</h2>
        {Object.keys(state.errors).map((field) => (
          <div
            key={field}
            className={classNames(styles.debug_row, state.errors[field as keyof T] != false && styles.debug_error)}
          >
            {field}: {JSON.stringify(state.errors[field as keyof T])}
          </div>
        ))}
      </div>
      <div className={styles.debug_column}>
        <h2 className={styles.debug_header}>Form fields</h2>
        {Object.keys(state.values).map((field) => (
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
      <SamfFormConfigContext.Provider value={{ validateOn }}>
        <form className={formClass} onAnimationEnd={() => setAnimateError(false)}>
          {children}
          {onSubmit !== undefined && (
            <div className={styles.submit_row}>
              <Button
                // {...submitButtonProps} // TODO: implement this
                preventDefault={true}
                type="submit"
                theme={submitButtonTheme}
                display={submitButtonDisplay}
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
