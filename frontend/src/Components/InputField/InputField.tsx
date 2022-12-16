import classNames from 'classnames';
import { Children } from '~/types';
import styles from './InputField.module.scss';

type types = 'text' | 'number' | 'email' | 'password';

type InputFieldProps = {
  children?: Children;
  labelClassName?: string;
  inputClassName?: string;
  onChange?: (e?: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string | null;
  type?: types;
  disabled?: boolean;
  value?: string;
};

export function InputField({
  children,
  labelClassName,
  inputClassName,
  onChange,
  placeholder,
  disabled,
  value,
  type = 'text',
}: InputFieldProps) {
  return (
    <label className={classNames(styles.label, labelClassName)}>
      {children}
      <input
        onChange={onChange}
        className={classNames(styles.input_field, inputClassName)}
        placeholder={placeholder || ''}
        disabled={disabled}
        type={type}
        value={value}
      />
    </label>
  );
}
