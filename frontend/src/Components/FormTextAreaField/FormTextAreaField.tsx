import classNames from 'classnames';
import { Children } from '~/types';
import { FieldValues, UseFormRegister } from 'react-hook-form/dist/types';
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
  errors?: Record<string, unknown>;
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
  return (
    <div className={className}>
      <label className={classNames(styles.label, labelClassName)}>
        {children}
        <textarea
          className={classNames(styles.input_field, inputClassName, errors && name in errors && styles.errors)}
          {...register(name, { required })}
          rows={rows}
          cols={cols}
        />
      </label>
      {errors && name in errors && <div className={styles.errors_text}>{errors[name].message}</div>}
    </div>
  );
}
