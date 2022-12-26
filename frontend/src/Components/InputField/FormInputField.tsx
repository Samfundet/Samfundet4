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
  errors?: Object;
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
            errors && errors.hasOwnProperty(name) && styles.errors,
          )}
          type={type}
          {...register(name, { required })}
        />
        {errors && errors.hasOwnProperty(name) && <div className={styles.errors_text}>{errors[name].message}</div>}
      </label>
    </div>
  );
}
