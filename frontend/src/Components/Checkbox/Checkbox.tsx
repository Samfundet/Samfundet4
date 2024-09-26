import classNames from 'classnames';
import React from 'react';
import styles from './Checkbox.module.scss';

export type CheckboxProps = {
  name?: string;
  disabled?: boolean;
  checked?: boolean;
  className?: string;
  onChange?: (...event: unknown[]) => void;
};

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(({ className, ...props }, ref) => {
  return (
    <label className={styles.checkbox}>
      <input type="checkbox" ref={ref} className={classNames(styles.checkbox__input, className)} {...props} />
      <div className={styles.checkbox__box} />
    </label>
  );
});
Checkbox.displayName = 'Checkbox';
