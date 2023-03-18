import classNames from 'classnames';
import { ChangeEvent } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';
import { Children } from '~/types';
import styles from './InputField.module.scss';

type types = 'text' | 'number' | 'email' | 'password';

type InputFieldProps<T> = {
  children?: Children;
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
  onChange?: (value: T) => void;
  placeholder?: string | null;
  type?: types;
  disabled?: boolean;
  value?: string;
  error?: string | boolean;
  helpText?: string;
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
  register,
}: InputFieldProps<T>) {
  function handleChange(e?: ChangeEvent<HTMLInputElement>) {
    onChange?.(e?.currentTarget.value as T);
  }
  return (
    <div className={className}>
      <label className={classNames(styles.label, labelClassName)}>
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
        {error && (error as string).length > 0 && (
          <div className={styles.error_container}>
            <div className={styles.error_text}>{error}</div>
          </div>
        )}
        {helpText && <p className={styles.helpText}>{helpText}</p>}
      </label>
      {helpText && <p className={styles.helpText}>{helpText}</p>}
    </div>
  );
}
