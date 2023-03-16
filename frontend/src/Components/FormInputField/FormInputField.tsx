import classNames from 'classnames';
import { FieldValues, UseFormRegister } from 'react-hook-form/dist/types';
import { Children } from '~/types';
import styles from './FormInputField.module.scss';

type types = 'text' | 'number' | 'email' | 'password' | 'date' | 'image' | 'datetime-local' | 'file' | 'time';

type FormInputFieldProps = {
  children?: Children;
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
  type?: types;
  name: string;
  register: UseFormRegister<FieldValues>;
  required?: boolean;
  helpText?: string;
  errors?: Record<string, unknown>;
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
  const inputStyle = classNames(styles.input_field, inputClassName, errors && name in errors && styles.errors);
  return (
    <div className={className}>
      <label className={classNames(styles.label, labelClassName)}>{children}</label>
      <input className={inputStyle} type={type} {...register(name, { required })} />
      {errors && name in errors && <div className={styles.errors_text}>{errors[name].message}</div>}
      {helpText && <p className={styles.helpText}>{helpText}</p>}
    </div>
  );
}
