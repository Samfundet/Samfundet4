import * as React from 'react';
import styles from './Input.module.scss';
import classNames from 'classnames';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onChange: (...event: unknown[]) => void;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, onChange, ...props }, ref) => {
  return (
    <input
      type={type}
      className={classNames(styles.input_field, type === 'number' && styles.number_input, className)}
      onChange={(event) => (type === 'number' ? onChange?.(+event.target.value) : onChange?.(event.target.value))}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = 'Input';
