import classNames from 'classnames';
import type { ReactNode } from 'react';
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
  children?: ReactNode;
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
          {options?.map((option, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: no other unique value available
            <option value={option.value} key={index} className={styles.option} selected={option.value === value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      {error && error.length > 0 && <div className={styles.error_text}>{error}</div>}
    </div>
  );
}
