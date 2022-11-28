import classNames from 'classnames';
import { Children } from '~/types';
import styles from './InputField.module.scss';

type types = 'text' | 'number' | 'email' | 'password';

type InputFieldProps = {
  children?: Children;
  className?: string;
  onChange?: (e?: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: types;
  value?: string;
};

export function InputField({ children, className, onChange, placeholder, value, type = 'text' }: InputFieldProps) {
  return (
    <label className={styles.label}>
      {children}
      <input
        onChange={onChange}
        className={classNames(styles.input_field, className)}
        placeholder={placeholder}
        type={type}
        value={value}
      />
    </label>
  );
}
