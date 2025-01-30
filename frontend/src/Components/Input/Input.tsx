import React from 'react';
import classNames from 'classnames';
import styles from './Input.module.scss';

/**
 * Common props shared by both controlled & uncontrolled versions.
 */
interface PrimitiveInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'defaultValue'> {
  className?: string;
  type?: React.HTMLInputTypeAttribute;
}

/**
 * Controlled props: requires `value`, forbids `defaultValue`.
 */
interface ControlledInputProps extends PrimitiveInputProps {
  value: string | number | readonly string[];
  defaultValue?: never;
}

/**
 * Uncontrolled props: requires `defaultValue`, forbids `value`.
 */
interface UncontrolledInputProps extends PrimitiveInputProps {
  value?: never;
  defaultValue?: string | number | readonly string[];
}

/**
 * Union type for either controlled or uncontrolled usage.
 */
export type InputProps = ControlledInputProps | UncontrolledInputProps;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, value, defaultValue, ...props }, ref) => {
    const isControlled = value !== undefined;

    // Optional: Map to specialized classNames based on `type`
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
    };

    return (
      <input
        ref={ref}
        type={type}
        className={classNames(styles.input, type && classMap[type], className)}
        // If controlled, pass `value`, else pass `defaultValue`.
        value={isControlled ? value : undefined}
        defaultValue={!isControlled ? defaultValue : undefined}
        {...props}
      />
    );
  },
);
Input.displayName = 'Input';
