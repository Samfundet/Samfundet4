import classNames from 'classnames';
import { Children } from '~/types';
import styles from './InputField.module.scss';

type types = 'text' | 'number' | 'email' | 'password';

type InputFieldProps = {
  children?: Children;
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
  onChange?: (e?: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string | null;
  type?: types;
  disabled?: boolean;
  value?: string;
  error?: string;
  helpText?: string;
};

export function InputField({
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
}: InputFieldProps) {
  return (
    <div className={className}>
      <label className={classNames(styles.label, labelClassName)}>
        {children}
        <input
          onChange={onChange}
          className={classNames(styles.input_field, inputClassName, error && error.length > 0 && styles.error)}
          placeholder={placeholder || ''}
          disabled={disabled}
          type={type}
          value={value}
        />
        {error && error.length > 0 && <div className={styles.error_text}>{error}</div>}
        {helpText && <p className={styles.helpText}>{helpText}</p>}
      </label>
      {helpText && <p className={styles.helpText}>{helpText}</p>}
    </div>
  );
}
