import classNames from 'classnames';
import { FieldValues, UseFormRegister } from 'react-hook-form/dist/types';
import { Children } from '~/types';
import styles from './FormTextAreaField.module.scss';

type FormTextAreaFieldProps = {
  children?: Children;
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
  rows?: number;
  cols?: number;
  name: string;
  register: UseFormRegister<FieldValues>;
  required?: boolean;
  errors?: Record<string, { message: string }>;
};

export function FormTextAreaField({
  children,
  className,
  inputClassName,
  labelClassName,
  errors,
  cols,
  name,
  required,
  register,
  rows = 10,
}: FormTextAreaFieldProps) {
  const isError = errors && name in errors;
  return (
    <div className={className}>
      <label className={classNames(styles.label, labelClassName)}>
        {children}
        <textarea
          className={classNames(styles.input_field, inputClassName, { [styles.errors]: isError })}
          {...register(name, { required })}
          rows={rows}
          cols={cols}
        />
      </label>
      {isError && <div className={styles.errors_text}>{errors[name].message}</div>}
    </div>
  );
}
