import React from 'react';
import classNames from 'classnames';
import styles from './Checkbox.module.scss';

export type PrimitiveCheckboxProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'checked' | 'defaultChecked' | 'type'
> & {
  className?: string;
};

/**
 * Controlled props: requires `checked`, forbids `defaultChecked`.
 */
interface ControlledCheckboxProps extends PrimitiveCheckboxProps {
  checked: boolean;
  defaultChecked?: never;
}

/**
 * Uncontrolled props: requires `defaultChecked`, forbids `checked`.
 */
interface UncontrolledCheckboxProps extends PrimitiveCheckboxProps {
  checked?: never;
  defaultChecked?: boolean;
}

/**
 * Union type for either controlled or uncontrolled usage.
 */
export type CheckboxProps = ControlledCheckboxProps | UncontrolledCheckboxProps;

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, defaultChecked, onChange, disabled, ...props }, ref) => {
    const isControlled = checked !== undefined;

    return (
      <label className={styles.checkbox}>
        <input
          ref={ref}
          type="checkbox"
          className={classNames(styles.checkbox__input, className)}
          checked={isControlled ? checked : undefined}
          defaultChecked={!isControlled ? defaultChecked : undefined}
          onChange={onChange}
          disabled={disabled}
          {...props}
        />
        <div className={styles.checkbox__box} />
      </label>
    );
  },
);

Checkbox.displayName = 'Checkbox';
