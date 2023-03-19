import { Icon } from '@iconify/react';
import { default as classNames, default as classnames } from 'classnames';
import { ChangeEvent } from 'react';
import { ReactElement } from 'react-markdown/lib/react-markdown';
import styles from './Dropdown.module.scss';

export type DropDownOption<T> = {
  label: string;
  value: T;
};

type DropdownProps<T> = {
  className?: string;
  wrapper?: string;
  default_value?: DropDownOption<T>;
  options?: DropDownOption<T>[];
  label?: string | ReactElement;
  disabled?: boolean;
  error?: boolean;
  onChange?: (value?: T) => void;
};

export function Dropdown<T>({
  options = [],
  wrapper,
  default_value,
  onChange,
  className,
  label,
  disabled = false,
  error,
}: DropdownProps<T>) {
  function handleChange(e?: ChangeEvent<HTMLSelectElement>) {
    const choice = (e?.currentTarget.value ?? 0) as number;
    if (choice == -1 || choice === undefined) {
      onChange?.(default_value?.value);
    } else if (choice >= 0 && choice <= options.length) {
      onChange?.(options[choice].value);
    } else {
      onChange?.(default_value?.value);
    }
  }
  return (
    <label className={classnames(styles.select_wrapper, wrapper)}>
      {label}
      <select
        className={classNames(styles.samf_select, error && styles.error)}
        onChange={handleChange}
        disabled={disabled}
      >
        {default_value && (
          <option value={-1} className={className}>
            {default_value.label}
          </option>
        )}
        {options.map((opt, index) => {
          return (
            <option value={index} key={index} className={className}>
              {opt.label}
            </option>
          );
        })}
      </select>
      <div className={styles.custom_select_arrow}>
        <Icon icon="material-symbols:arrow-drop-down-circle" width={20} />
      </div>
      {/* span inneholder "nedover pil" symbol */}
    </label>
  );
}
