import classNames from 'classnames';
import { Children } from '~/types';
import { FieldValues, UseFormRegister } from 'react-hook-form/dist/types';
import styles from './TextAreaField.module.scss';

type TextAreaFieldProps = {
  children?: Children;
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
  rows?: number;
  cols?: number;
  name: string;
  register: UseFormRegister<FieldValues>;
  required?: boolean;
  error?: string;
};

export function FormTextAreaField({
  children,
  className,
  inputClassName,
  labelClassName,
  error,
  cols,
  name,
  required,
  register,
  rows = 10,
}: TextAreaFieldProps) {
  return (
    <div className={className}>
      <label className={classNames(styles.label, labelClassName)}>
        {children}
        <textarea
          className={classNames(
            styles.input_field,
            inputClassName,
            error && error.hasOwnProperty(name) && styles.error,
          )}
          {...register(name, { required })}
          rows={rows}
          cols={cols}
        />
      </label>
      {error && error.hasOwnProperty(name) && <div className={styles.error_text}>{error}</div>}
    </div>
  );
}
