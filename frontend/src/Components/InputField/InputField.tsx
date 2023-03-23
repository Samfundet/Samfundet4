import { Icon } from '@iconify/react';
import classNames from 'classnames';
import { ChangeEvent } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';
import { Children } from '~/types';
import styles from './InputField.module.scss';

export type InputFieldType = 'text' | 'number' | 'email' | 'password' | 'datetime-local';

type InputFieldProps<T> = {
  children?: Children;
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
  onChange?: (value: T) => void;
  placeholder?: string | null;
  type?: InputFieldType;
  disabled?: boolean;
  value?: string;
  error?: string | boolean;
  helpText?: string;
  icon?: string;
  register?: UseFormRegisterReturn;
};

export function InputField<T>({
  children,
  className,
  labelClassName,
  inputClassName,
  onChange,
  placeholder,
  disabled,
  value,
  error,
  helpText,
  type = 'text',
  icon,
  register,
}: InputFieldProps<T>) {
  function handleChange(e?: ChangeEvent<HTMLInputElement>) {
    let value: string | number | undefined = e?.currentTarget.value ?? '';
    if (type === 'number') {
      if (value.length > 0) {
        value = Number.parseFloat(value as string);
      } else {
        value = undefined;
      }
    }
    onChange?.(value as T);
  }
  return (
    <label className={classNames(className, styles.label, disabled && styles.disabled_label, labelClassName)}>
      {children}
      <input
        onChange={handleChange}
        className={classNames(styles.input_field, inputClassName, error && styles.error)}
        placeholder={placeholder || ''}
        disabled={disabled}
        type={type}
        value={value}
        {...register}
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
