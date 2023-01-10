import classNames from 'classnames';
import { FieldValues, UseFormRegister } from 'react-hook-form/dist/types';
import { Children } from '~/types';
import styles from './FormSelect.module.scss';

type FormSelectProps = {
  className?: string;
  labelClassName?: string;
  selectClassName?: string;
  options?: string[][];
  name: string;
  register: UseFormRegister<FieldValues>;
  required?: boolean;
  children?: Children;
  errors?: Record<string, unknown>;
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
  return (
    <div className={className}>
      <label className={classNames(styles.label, labelClassName)}>
        {children}
        <select
          {...register(name, { required })}
          className={classNames(styles.select, selectClassName, errors && name in errors && styles.error)}
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
      {errors && name in errors && <div className={styles.error_text}>{errors[name].message}</div>}
    </div>
  );
}
