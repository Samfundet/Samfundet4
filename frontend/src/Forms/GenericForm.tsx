import { t } from 'i18next';
import { ReactElement, useCallback, useEffect, useState } from 'react';
import { Button, Dropdown, InputField, TextAreaField } from '~/Components';
import { DropDownOption } from '~/Components/Dropdown/Dropdown';
import { ImagePicker } from '~/Components/ImagePicker/ImagePicker';
import { InputFieldType } from '~/Components/InputField/InputField';
import { ImageDto } from '~/dto';
import { usePrevious } from '~/hooks';
import { KEY } from '~/i18n/constants';
import styles from './GenericForm.module.scss';

type FormFieldType = 'text' | 'text-long' | 'number' | 'datetime' | 'options' | 'image';
type FormFieldValidation = 'submit' | 'change';

export type FormField<U> = {
  key: string;
  type: FormFieldType;
  label?: ReactElement | string;
  required?: boolean;
  validator?<U>(data: U): boolean | string;
  _?: U; // eslint does not detect (data: U) as use of type
};

export type OptionsFormField<T> = FormField<T> & {
  options: DropDownOption<T>[];
  default?: DropDownOption<T>;
};

type FormProps<T> = {
  initialData?: Partial<T>;
  layout: FormField<unknown>[][];
  validateOn?: FormFieldValidation;
  validateOnInit?: boolean;
  showSubmitButton?: boolean;
  onChange<T>(data: Partial<T>): void;
  onValid?(valid: boolean): void;
  onSubmit?(data: Partial<T>): void;
};

// Default requirement validation (field cannot be empty/null)
function isRequirementSatisfied(field: FormField<unknown>, value: unknown) {
  if (field.required === false) {
    return true;
  }
  if (value === undefined || value === null || (value as string) === '') {
    return false;
  }
  return true;
}

// Gets the current error state for a field
// Returns true (or an error string) if field has errors
function getFieldError(field: FormField<unknown>, value: unknown): boolean | string {
  // Run validation
  if (!isRequirementSatisfied(field, value)) {
    return true; // field is required
  }
  const validatorResult = field.validator?.(value);
  if (validatorResult === true) {
    return false; // everything OK
  }
  return validatorResult ?? false;
}

export function GenericForm<T>({
  initialData = {},
  layout,
  validateOn = 'submit',
  validateOnInit = false,
  showSubmitButton = true,
  onChange,
  onValid,
  onSubmit,
}: FormProps<T>) {
  const allFields = Object.keys(initialData);

  // General states
  const [didInit, setDidInit] = useState<boolean>(false);
  const [formData, setFormData] = useState<Record<string, unknown>>({ ...initialData });
  const [validationState, setValidationState] = useState<Record<string, boolean | string>>({});
  const [changedFields, setChangedFields] = useState<string[]>([]);
  const prevValidateOnInit = usePrevious(validateOnInit);

  // Update value in form
  function updateValue<T>(field: FormField<T>, newValue?: T) {
    if (allFields.indexOf(field.key) == -1) {
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

  // ================================== //
  //             Validation             //
  // ================================== //

  // Update validation state for given fields
  const updateValidation = useCallback(
    (keys: string[]) => {
      let newValidation: Record<string, string | boolean> = {};
      layout.forEach((row) => {
        row.forEach((field) => {
          if (!keys.includes(field.key)) {
            return;
          }
          // Update validations
          newValidation = {
            ...newValidation,
            [field.key]: getFieldError(field, formData[field.key]),
          };
        });
      });
      // Rerender form with new validation state
      setValidationState({
        ...validationState,
        ...newValidation,
      });
    },
    [layout, formData, validationState, setValidationState],
  );

  // ================================== //
  //              Effects               //
  // ================================== //

  // Validate changes and update parent
  useEffect(() => {
    // Validate on init (or when validate on init is suddenly turned on)
    if (validateOnInit) {
      if (!didInit || prevValidateOnInit === false) {
        updateValidation(allFields);
      }
    }
    // Validate and update parent
    if (changedFields.length > 0) {
      if (validateOn === 'change') {
        updateValidation(changedFields);
      }
      onChange<T>(formData as T);
    }
    // Check if everything valid
    if (!didInit || changedFields.length > 0) {
      let valid = true;
      layout.forEach((row) => {
        row.forEach((field) => {
          if (getFieldError(field, formData[field.key]) != false) {
            valid = false;
          }
        });
      });
      onValid?.(valid);
    }
    // Reset dirty state
    if (changedFields.length > 0) {
      setChangedFields([]);
    }
    if (!didInit) {
      setDidInit(true);
    }
  }, [
    changedFields,
    updateValidation,
    setChangedFields,
    onChange,
    formData,
    didInit,
    layout,
    onValid,
    validateOn,
    validateOnInit,
    allFields,
    prevValidateOnInit,
  ]);

  // ================================== //
  //              Input UI              //
  // ================================== //

  // Regular text input for text, numbers, dates
  function makeStandardInput<U>(field: FormField<U>, type: InputFieldType) {
    return (
      <InputField<U>
        key={field.key}
        placeholder="some"
        value={(formData[field.key] ?? '') as string}
        onChange={(v: U) => updateValue<U>(field, v)}
        disabled={allFields.indexOf(field.key) == -1}
        error={validationState[field.key] ?? false}
        className={styles.input_element}
        type={type}
      >
        {field.label}
      </InputField>
    );
  }

  // Long text input for descriptions etc
  function makeAreaInput(field: FormField<string>) {
    return (
      <TextAreaField
        key={field.key}
        placeholder="some"
        value={(formData[field.key] ?? '') as string}
        onChange={(v: string) => updateValue<string>(field, v)}
        disabled={allFields.indexOf(field.key) == -1}
        error={validationState[field.key] ?? false}
        className={styles.input_element}
      >
        {field.label}
      </TextAreaField>
    );
  }

  // Long text input for descriptions etc
  function makeOptionsInput<T>(field: OptionsFormField<T>) {
    return (
      <Dropdown<T>
        key={field.key}
        default_value={field.default}
        options={field.options}
        onChange={(v?: T) => updateValue<T>(field, v)}
        disabled={allFields.indexOf(field.key) == -1}
        label={field.label}
        error={validationState[field.key] ? true : false}
        className={styles.input_element}
      />
    );
  }

  // Image picker
  function makeImagePicker(field: FormField<ImageDto>) {
    return (
      <ImagePicker
        key={field.key}
        onSelected={(v?: ImageDto) => updateValue<ImageDto>(field, v)}
      />
    );
  }

  // Make form field UI
  function makeFormField<U>(field: FormField<U>) {
    switch (field.type) {
      case 'text':
        return makeStandardInput<string>(field as FormField<string>, 'text');
      case 'text-long':
        return makeAreaInput(field as FormField<string>);
      case 'datetime':
        return makeStandardInput<string>(field as FormField<string>, 'datetime-local');
      case 'number':
        return makeStandardInput<number>(field as FormField<number>, 'number');
      case 'options':
        return makeOptionsInput<T>(field as OptionsFormField<T>);
      case 'image':
        return makeImagePicker(field as FormField<ImageDto>);
    }
    return <b>FORM FIELD TYPE {field.type} NOT IMPLEMENTED</b>;
  }

  return (
    <div>
      <div className={styles.form_container}>
        {layout.map((row, index) => {
          return (
            <div key={index} className={styles.input_row}>
              {row.map((field) => makeFormField(field))}
            </div>
          );
        })}
        {showSubmitButton && (
          <div className={styles.button_row}>
            <Button theme="green" rounded={true} onClick={() => onSubmit?.(formData as Partial<T>)}>
              {t(KEY.common_save)}
            </Button>
          </div>
        )}
      </div>
      {/* DEBUG */}
      {/*
      <br></br>
      <code>allFields: {JSON.stringify(allFields)}</code>
      <br></br>
      <code>errors: {JSON.stringify(validationState, null, 2)}</code>
      <br></br>
      <code>formData: {JSON.stringify(formData)}</code>
      */}
    </div>
  );
}
