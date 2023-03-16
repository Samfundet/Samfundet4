import classNames from 'classnames';
import { FieldErrors, FieldValues, Message, UseFormRegister, ValidationRule } from 'react-hook-form/dist/types';
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
  required?: Message | ValidationRule<boolean> | null;
  errors?: FieldErrors;
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

  /** RHF required doesn't allow null value. */
  const required_ = required || undefined;

  return (
    <div className={className}>
      <label className={classNames(styles.label, labelClassName)}>
        {children}
        <textarea
          className={classNames(styles.input_field, inputClassName, { [styles.errors]: isError })}
          {...register(name, { required: required_ })}
          rows={rows}
          cols={cols}
        />
      </label>
      {isError && <div className={styles.errors_text}>{errors[name]?.message as string}</div>}
    </div>
  );
}
