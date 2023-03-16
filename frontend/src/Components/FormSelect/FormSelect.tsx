import classNames from 'classnames';
import { FieldValues, Message, UseFormRegister, ValidationRule } from 'react-hook-form/dist/types';
import { Children } from '~/types';
import styles from './FormSelect.module.scss';

type FormSelectProps = {
  className?: string;
  labelClassName?: string;
  selectClassName?: string;
  options?: string[][] | undefined;
  name: string;
  register: UseFormRegister<FieldValues>;
  required?: Message | ValidationRule<boolean> | null;
  children?: Children;
  errors?: Record<string, { message: string }>;
};

export function FormSelect({
  options,
  className,
  labelClassName,
  selectClassName,
  name,
  required,
  register,
  errors,
  children,
}: FormSelectProps) {
  const isError = errors && name in errors;

  /** RHF required doesn't allow null value. */
  const required_ = required || undefined;

  return (
    <div className={className}>
      <label className={classNames(styles.label, labelClassName)}>
        {children}
        <select
          {...register(name, { required: required_ })}
          className={classNames(styles.select, selectClassName, { [styles.error]: isError })}
        >
          <option value="" className={styles.option}>
            -------
          </option>
          {options?.map(function (element, index) {
            return (
              <option value={element[0]} key={index} className={styles.option}>
                {element[element.length - 1]}
              </option>
            );
          })}
        </select>
      </label>
      {isError && <div className={styles.error_text}>{errors[name].message}</div>}
    </div>
  );
}
