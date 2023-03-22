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
  defaultValue?: DropDownOption<T>;
  options?: DropDownOption<T>[];
  label?: string | ReactElement;
  disabled?: boolean;
  error?: boolean;
  onChange?: (value?: T) => void;
};

export function Dropdown<T>({
  options = [],
  defaultValue,
  onChange,
  className,
  label,
  disabled = false,
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
        className={classNames(styles.samf_select, error && styles.error)}
        onChange={handleChange}
        disabled={disabled}
        defaultValue={-1}
      >
        {defaultValue ? <option value={-1}>{defaultValue.label}</option> : <option selected value={-1}></option>}
        {options.map((opt, index) => {
          return (
            <option value={index} key={index}>
              {opt.label}
            </option>
          );
        })}
      </select>
      <div className={styles.arrow_container}>
        <Icon icon="material-symbols:arrow-drop-down-circle" width={20} className={styles.arrow} />
      </div>
      {/* span inneholder "nedover pil" symbol */}
    </label>
  );
}
