import { Icon } from '@iconify/react';
import classNames from 'classnames';
import { ChangeEvent } from 'react';
import { Children } from '~/types';
import styles from './InputField.module.scss';

export type InputFieldType = 'text' | 'number' | 'email' | 'password' | 'datetime-local' | 'time';

type InputFieldProps<T> = {
  children?: Children;
  labelClassName?: string;
  inputClassName?: string;
  onChange?: (value: T) => void;
  onBlur?: (value: T) => void;
  placeholder?: string;
  type?: InputFieldType;
  disabled?: boolean;
  value?: string;
  error?: string | boolean;
  helpText?: string;
  icon?: string;
};

export function InputField<T>({
  children,
  labelClassName,
  inputClassName,
  onChange,
  onBlur,
  placeholder = '',
  disabled,
  value,
  error,
  helpText,
  type = 'text',
  icon,
}: InputFieldProps<T>) {
  function preprocessValue(e?: ChangeEvent<HTMLInputElement>) {
    let value: string | number | undefined = e?.currentTarget.value ?? '';
    if (type === 'number') {
      if (value.length > 0) {
        value = Number.parseFloat(value as string);
      } else {
        value = undefined;
      }
    }
    return value as T;
  }
  return (
    <label className={classNames(styles.label, disabled && styles.disabled_label, labelClassName)}>
      {children}
      <input
        onChange={(e) => onChange?.(preprocessValue(e))}
        onBlur={(e) => onBlur?.(preprocessValue(e))}
        className={classNames(styles.input_field, inputClassName, error && styles.error)}
        placeholder={placeholder}
        disabled={disabled}
        type={type}
        value={value}
      />
      {icon && (
        <div className={styles.icon_container}>
          <Icon icon={icon} width={24} className={styles.field_icon} />
        </div>
      )}
      {error && (error as string).length > 0 && (
        <div className={styles.error_container}>
          <div className={styles.error_text}>{error}</div>
        </div>
      )}
      {helpText && <p className={styles.helpText}>{helpText}</p>}
    </label>
  );
}
