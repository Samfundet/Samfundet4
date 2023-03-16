import classNames from 'classnames';
import { FieldErrors, FieldValues, Message, UseFormRegister, ValidationRule } from 'react-hook-form/dist/types';
import { Children } from '~/types';
import styles from './FormInputField.module.scss';

type types = 'text' | 'number' | 'email' | 'password' | 'date' | 'image' | 'datetime-local' | 'file';

type FormInputFieldProps = {
  children?: Children;
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
  type?: types;
  name: string;
  register: UseFormRegister<FieldValues>;
  required?: Message | ValidationRule<boolean> | null;
  helpText?: string;
  errors?: FieldErrors;
};

export function FormInputField({
  children,
  className,
  labelClassName,
  inputClassName,
  errors,
  name,
  required,
  register,
  helpText,
  type = 'text',
}: FormInputFieldProps) {
  const isError = errors && name in errors;
  const classnames = classNames(styles.input_field, inputClassName, { [styles.errors]: isError });

  /** RHF required doesn't allow null value. */
  const required_ = required || undefined;

  return (
    <div className={className}>
      <label className={classNames(styles.label, labelClassName)}>
        {children}
        <input className={classnames} type={type} {...register(name, { required: required_ })} />
        {isError && <div className={styles.errors_text}>{errors[name]?.message as string}</div>}
      </label>
      {helpText && <p className={styles.helpText}>{helpText}</p>}
    </div>
  );
}
