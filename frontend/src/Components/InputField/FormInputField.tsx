import classNames from 'classnames';
import { FieldValues, UseFormRegister } from 'react-hook-form/dist/types';
import { Children } from '~/types';
import styles from './InputField.module.scss';

type types = 'text' | 'number' | 'email' | 'password';

type InputFieldProps = {
  children?: Children;
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
  type?: types;
  name: string;
  register: UseFormRegister<FieldValues>;
  required?: boolean;
  error?: Object;
};

export function FormInputField({
  children,
  className,
  labelClassName,
  inputClassName,
  error,
  name,
  required,
  register,
  type = 'text',
}: InputFieldProps) {
  return (
    <div className={className}>
      <label className={classNames(styles.label, labelClassName)}>
        {children}
        <input
          className={classNames(
            styles.input_field,
            inputClassName,
            error && error.hasOwnProperty(name) && styles.error,
          )}
          type={type}
          {...register(name, { required })}
        />
        {error && error.hasOwnProperty(name) && <div className={styles.error_text}>{error[name]}</div>}
      </label>
    </div>
  );
}
