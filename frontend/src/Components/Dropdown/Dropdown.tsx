import { Icon } from '@iconify/react';
import { default as classNames, default as classnames } from 'classnames';
import { ChangeEvent, ReactElement, useEffect, useState } from 'react';
import styles from './Dropdown.module.scss';

export type DropDownOption<T> = {
  label: string;
  value: T;
};

export type DropdownProps<T> = {
  className?: string;
  defaultValue?: DropDownOption<T>;
  initialValue?: T;
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
  label,
  disabled = false,
  error,
}: DropdownProps<T>) {
  const [startVal, setStartValue] = useState<number>(-1);
  /**
   * Handles the raw change event from <option>
   * The raw value choice is an index where -1 is reserved for
   * the empty/default option. Depending on the index selected
   * the onChange callback is provided with the respective DropDownOption
   * @param e Standard onChange HTML event for dropdown
   */
  useEffect(() => {
    if (options.length > 0 && initialValue !== undefined) {
      setStartValue(initialValue !== undefined ? options.map((e) => e.value).indexOf(initialValue) : -1);
    }
  }, [initialValue, options]);

  function handleChange(e?: ChangeEvent<HTMLSelectElement>) {
    const choice = (e?.currentTarget.value ?? 0) as number;
    if (choice >= 0 && choice <= options.length) {
      onChange?.(options[choice].value);
    } else {
      onChange?.(defaultValue?.value ?? undefined);
    }
  }
  return (
    <label className={classnames(className, styles.select_wrapper)}>
      {label}
      <select
        className={classNames(styles.samf_select, error && styles.error)}
        onChange={handleChange}
        disabled={disabled}
        defaultValue={startVal}
      >
        {defaultValue ? <option value={-1}>{defaultValue.label}</option> : <option value={-1}></option>}
        {options.map((opt, index) => {
          return (
            <option value={index} key={index} selected={index == startVal}>
              {opt.label}
            </option>
          );
        })}
      </select>
      {/* span inneholder "nedover pil" symbol */}
      <div className={styles.arrow_container}>
        <Icon icon="material-symbols:arrow-drop-down-circle" width={20} className={styles.arrow} />
      </div>
    </label>
  );
}
