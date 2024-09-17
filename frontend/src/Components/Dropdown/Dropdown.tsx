import { Icon } from '@iconify/react';
import { default as classNames, default as classnames } from 'classnames';
import { ChangeEvent, ReactElement } from 'react';
import styles from './Dropdown.module.scss';

export type DropDownOption<T> = {
  label: string;
  value: T;
};

export type DropdownProps<T> = {
  className?: string;
  classNameSelect?: string;
  defaultValue?: DropDownOption<T>;
  initialValue?: T;
  disableIcon?: boolean;
  options?: DropDownOption<T>[];
  label?: string | ReactElement;
  disabled?: boolean;
  error?: boolean;
  onChange?: (value?: T) => void;
};

export function Dropdown<T>({
  options = [],
  defaultValue,
  initialValue,
  onChange,
  className,
  classNameSelect,
  label,
  disabled = false,
  disableIcon = false,
  error,
}: DropdownProps<T>) {
  /**
   * Handles the raw change event from <option>
   * The raw value choice is an index where -1 is reserved for
   * the empty/default option. Depending on the index selected
   * the onChange callback is provided with the respective DropDownOption
   * @param e Standard onChange HTML event for dropdown
   */
  function handleChange(e?: ChangeEvent<HTMLSelectElement>) {
    const choice = parseInt(e?.currentTarget.value ?? '0', 10);
    if (choice >= 0 && choice < options.length) {
      onChange?.(options[choice].value);
    } else {
      onChange?.(defaultValue?.value ?? options[0]?.value);
    }
  }

  const initialIndex = initialValue !== undefined
    ? options.findIndex((opt) => opt.value === initialValue)
    : defaultValue
      ? options.findIndex((opt) => opt.value === defaultValue.value)
      : 0;

  return (
    <label className={classnames(className, styles.select_wrapper)}>
      {label}
      <select
        className={classNames(
          classNameSelect,
          styles.samf_select,
          !disableIcon && styles.icon_disabled,
          error && styles.error,
        )}
        onChange={handleChange}
        disabled={disabled}
        defaultValue={initialIndex}
      >
        {options.map((opt, index) => (
          <option value={index} key={index}>
            {opt.label}
          </option>
        ))}
      </select>
      {!disableIcon && (
        <div className={styles.arrow_container}>
          <Icon icon="mdi:caret" rotate={2} width={20} className={styles.arrow} />
        </div>
      )}
    </label>
  );
}
