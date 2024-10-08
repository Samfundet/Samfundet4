import classNames from 'classnames';
import * as React from 'react';
import styles from './Input.module.scss';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  onChange: (value: string | number | readonly string[] | null) => void;
  value: string | number | readonly string[] | null;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, onChange, value, ...props }, ref) => {
    return (
      <input
        type={type}
        className={classNames(styles.input_field, type === 'number' && styles.number_input, className)}
        onChange={(event) => (type === 'number' ? onChange?.(+event.target.value) : onChange?.(event.target.value))}
        ref={ref}
        value={value === null ? '' : value}
        {...props}
      />
    );
  },
);
Input.displayName = 'Input';
