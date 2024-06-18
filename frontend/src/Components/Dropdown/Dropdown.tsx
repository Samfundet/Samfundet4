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
  defaultValue?: DropDownOption<T>; // issue 1089
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
        className={classNames(
          classNameSelect,
          styles.samf_select,
          !disableIcon && styles.icon_disabled,
          error && styles.error,
        )}
        onChange={handleChange}
        disabled={disabled}
        defaultValue={initialValue !== undefined ? options.map((e) => e.value).indexOf(initialValue) : -1}
      >
        {defaultValue ? <option value={-1}>{defaultValue.label}</option> : <option value={-1}></option>}
        {options.map((opt, index) => {
          return (
            <option value={index} key={index}>
              {opt.label}
            </option>
          );
        })}
      </select>
      {!disableIcon && (
        <div className={styles.arrow_container}>
          <Icon icon="mdi:caret" rotate={2} width={20} className={styles.arrow} />
        </div>
      )}
    </label>
  );
}
