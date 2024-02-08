import classNames from 'classnames';
import { ChangeEvent } from 'react';
import { Children } from '~/types';
import styles from './TextAreaField.module.scss';

export type TextAreaFieldProps = {
  children?: Children;
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
  onChange?: (value: string) => void;
  placeholder?: string | null;
  rows?: number;
  cols?: number;
  value?: string;
  error?: string | boolean;
  disabled?: boolean;
};

export function TextAreaField({
  children,
  className,
  inputClassName,
  labelClassName,
  onChange,
  placeholder,
  value,
  error,
  cols,
  rows = 10,
  disabled = false,
}: TextAreaFieldProps) {
  function handleChange(e?: ChangeEvent<HTMLTextAreaElement>) {
    const value = e?.currentTarget.value ?? '';
    onChange?.(value);
  }

  const isErrorMsg = error && (error as string).length > 0;

  return (
    <label className={classNames(className, styles.label, labelClassName)}>
      {children}
      <textarea
        onChange={handleChange}
        className={classNames(styles.input_field, inputClassName, error && styles.error)}
        placeholder={placeholder || ''}
        disabled={disabled}
        rows={rows}
        cols={cols}
        value={value}
      />
      {isErrorMsg && (
        <div className={styles.error_container}>
          <div className={styles.error_text}>{error}</div>
        </div>
      )}
    </label>
  );
}
