import classNames from 'classnames';
import { Children } from '~/types';
import styles from './Select.module.scss';

type Option = {
  value: string | number;
  label: string;
};

type SelectProps = {
  name: string;
  className?: string;
  labelClassName?: string;
  options?: Option[];
  required?: boolean;
  onChange?: (e?: React.ChangeEvent<HTMLSelectElement>) => void;
  value?: string;
  error?: string;
  children?: Children;
};

export function Select({
  options,
  className,
  labelClassName,
  value,
  error,
  onChange,
  required = false,
  children,
}: SelectProps) {
  return (
    <div className={className}>
      <label className={classNames(styles.label, labelClassName)}>
        {children}
        <select onChange={onChange} required={required} className={styles.select}>
          {options?.map(function (option, index) {
            return (
              <option value={option.value} key={index} className={styles.option} selected={option.value == value}>
                {option.label}
              </option>
            );
          })}
        </select>
      </label>
      {error && error.length > 0 && <div className={styles.error_text}>{error}</div>}
    </div>
  );
}
