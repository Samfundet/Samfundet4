import { Icon } from '@iconify/react';
import { default as classNames, default as classnames } from 'classnames';
import React, { type ChangeEvent, type ReactElement, useMemo } from 'react';
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
  addNullOption?: boolean;
};

function DropdownInner<T>(
  {
    options = [],
    defaultValue,
    initialValue,
    onChange,
    className,
    classNameSelect,
    label,
    disabled = false,
    disableIcon = false,
    addNullOption = false,
    error,
  }: DropdownProps<T>,
  ref: React.Ref<HTMLSelectElement>,
) {
  const finalOptions = useMemo<DropDownOption<T>[]>(() => {
    if (!addNullOption) {
      return options;
    }
    return [{ value: null, label: '' } as DropDownOption<T>, ...options];
  }, [options, addNullOption]);

  /**
   * Handles the raw change event from <option>
   * The raw value choice is an index where -1 is reserved for
   * the empty/default option. Depending on the index selected
   * the onChange callback is provided with the respective DropDownOption
   * @param e Standard onChange HTML event for dropdown
   */
  function handleChange(e?: ChangeEvent<HTMLSelectElement>) {
    const choice = Number.parseInt(e?.currentTarget.value ?? '0', 10);
    if (choice >= 0 && choice < finalOptions.length) {
      onChange?.(finalOptions[choice].value);
    } else {
      onChange?.(defaultValue?.value ?? finalOptions[0]?.value);
    }
  }

  let initialIndex = 0;
  if (initialValue !== undefined) {
    initialIndex = finalOptions.findIndex((opt) => opt.value === initialValue);
  } else if (defaultValue) {
    initialIndex = finalOptions.findIndex((opt) => opt.value === defaultValue.value);
  }

  return (
    <label className={classnames(className, styles.select_wrapper)}>
      {label}
      <select
        ref={ref}
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
        {finalOptions.map((opt, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: no other unique value available
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

export const Dropdown = React.forwardRef(DropdownInner) as <T>(
  props: DropdownProps<T> & {
    ref?: React.Ref<HTMLSelectElement>;
  },
) => ReturnType<typeof DropdownInner>;
(Dropdown as React.ForwardRefExoticComponent<unknown>).displayName = 'Dropdown';
