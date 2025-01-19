import classNames from 'classnames';
import * as React from 'react';
import styles from './Input.module.scss';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  const classMap: Record<string, string> = {
    date: styles.date,
    'datetime-local': styles.datetimeLocal,
    email: styles.email,
    month: styles.month,
    number: styles.number,
    password: styles.password,
    search: styles.search,
    tel: styles.tel,
    text: styles.text,
    time: styles.time,
    url: styles.url,
    week: styles.week,
  } as const;

  return (
    <input
      ref={ref}
      type={type}
      className={classNames(styles.input, type ? classMap[type] : '', className)}
      {...props}
    />
  );
});
Input.displayName = 'Input';
