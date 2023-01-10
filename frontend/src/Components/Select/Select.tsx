import classNames from 'classnames';
import { Children } from '~/types';
import styles from './Select.module.scss';

type SelectProps = {
  name: string;
  className?: string;
  labelClassName?: string;
  options?: string[][];
  required?: boolean;
  onChange?: (e?: React.ChangeEvent<HTMLInputElement>) => void;
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
          {options?.map(function (element, index) {
            return (
              <option
                value={element[0]}
                key={index}
                className={styles.option}
                selected={element[0] == value && 'selected'}
              >
                {element[1]}
              </option>
            );
          })}
        </select>
      </label>
      {error && error.length > 0 && <div className={styles.error_text}>{error}</div>}
    </div>
  );
}
