import classNames from 'classnames';
import { Children } from '~/types';
import styles from './TextAreaField.module.scss';

type TextAreaFieldProps = {
  children?: Children;
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
  onChange?: (e?: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string | null;
  rows?: number;
  cols?: number;
  value?: string;
  error?: string;
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
}: TextAreaFieldProps) {
  return (
    <div className={className}>
      <label className={classNames(styles.label, labelClassName)}>
        {children}
        <textarea
          onChange={onChange}
          className={classNames(styles.input_field, inputClassName, error && error.length > 0 && styles.error)}
          placeholder={placeholder || ''}
          rows={rows}
          cols={cols}
          value={value}
        />
      </label>
      {error && error.length > 0 && <div className={styles.error_text}>{error}</div>}
    </div>
  );
}
