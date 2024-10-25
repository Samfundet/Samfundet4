import { Icon } from '@iconify/react';
import { default as classNames, default as classnames } from 'classnames';
import React, { type ChangeEvent, type ReactNode, useMemo } from 'react';
import styles from './Dropdown.module.scss';

export type DropDownOption<T> = {
  label: string;
  value: T;
};

type PrimitiveDropdownProps<T> = {
  className?: string;
  classNameSelect?: string;
  options?: DropDownOption<T>[];
  label?: string | ReactNode;
  disabled?: boolean;
  error?: boolean;
  disableIcon?: boolean;
  addNullOption?: boolean;
  onChange?: (value: T | null) => void;
};

type ControlledDropdownProps<T> = PrimitiveDropdownProps<T> & {
  value: T | null;
  defaultValue?: never;
};

type UncontrolledDropdownProps<T> = PrimitiveDropdownProps<T> & {
  value?: never;
  defaultValue?: T | null;
};

type DropdownProps<T> = ControlledDropdownProps<T> | UncontrolledDropdownProps<T>;

function DropdownInner<T>(
  {
    options = [],
    defaultValue,
    value,
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
  const isControlled = value !== undefined;

  const finalOptions = useMemo<DropDownOption<T>[]>(() => {
    if (!addNullOption) {
      return options;
    }
    return [{ value: null, label: '' } as DropDownOption<T>, ...options];
  }, [options, addNullOption]);

  const selectedIndex = useMemo(() => {
    if (isControlled) {
      return finalOptions.findIndex((opt) => opt.value === value);
    }
    if (defaultValue !== undefined) {
      return finalOptions.findIndex((opt) => opt.value === defaultValue);
    }
    return 0; // fall back to selecting first element
  }, [isControlled, value, defaultValue, finalOptions]);

  function handleChange(event: ChangeEvent<HTMLSelectElement>) {
    const index = Number.parseInt(event.currentTarget.value, 10);
    if (index >= 0 && index < finalOptions.length) {
      onChange?.(finalOptions[index].value);
    }
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
        defaultValue={!isControlled ? selectedIndex : undefined}
        value={isControlled ? selectedIndex : undefined}
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
