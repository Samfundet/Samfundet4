import classNames from 'classnames';
import { Children } from '~/types';
import styles from './TextAreaField.module.scss';

type types = 'text' | 'number' | 'email' | 'password';

type TextAreaFieldProps = {
  children?: Children;
  className?: string;
  onChange?: (e?: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string | null;
  rows?: number;
  value?: string;
};

export function TextAreaField({
  children,
  className,
  onChange,
  placeholder,
  value,
  rows = 10,
}: TextAreaFieldProps) {
  return (
    <label className={styles.label}>
      {children}
      <textarea
        onChange={onChange}
        className={classNames(styles.input_field, className)}
        placeholder={placeholder || ''}
        rows={rows}
        value={value}
      />
    </label>
  );
}
