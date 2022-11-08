import { Children } from '~/types';
import styles from './InputField.module.scss';

type types = 'text' | 'number' | 'emai' | 'password';

type InputFieldProps = {
  children?: Children;
  className?: string;
  onChange?: (e?: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: types;
};

export function InputField({ children, className, onChange, placeholder, type = 'text' }: InputFieldProps) {
  return (
    <label className={styles.label}>
      {children}
      <input
        onChange={onChange}
        className={`${styles.InputField_field} ${className}`}
        placeholder={placeholder}
        type={type}
      />
    </label>
  );
}
