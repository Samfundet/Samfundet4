import * as React from 'react';
import styles from './Input.module.scss';
import classNames from 'classnames';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

/* eslint-disable react/prop-types */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={classNames(styles.input_field, type === 'number' && styles.number_input, className)}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = 'Input';
