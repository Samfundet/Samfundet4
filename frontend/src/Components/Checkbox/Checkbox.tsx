import classNames from 'classnames';
import { useState } from 'react';
import styles from './Checkbox.module.scss';

type Alignment = 'left' | 'right';

type CheckboxProps = {
  name?: string;
  label?: string;
  disabled?: boolean;
  checked?: boolean;
  onClick?: () => void;
  alignment?: Alignment;
  className?: string;
  onChange?: (value: boolean) => void;
  error?: string | boolean;
  value?: boolean;
};

// TODO: Add error handling, eg. display red text when error is set
export function Checkbox({
  name,
  onClick,
  disabled,
  checked,
  className,
  alignment = 'left',
  label,
  onChange,
}: CheckboxProps) {
  const [isChecked, setIsChecked] = useState(checked ?? false);

  function handleChange() {
    setIsChecked(!isChecked);
    if (onChange !== undefined) {
      return onChange?.(isChecked);
    }
    return onClick;
  }

  return (
    <label className={styles.checkbox}>
      {alignment == 'left' && label}
      <input
        className={classNames(styles.checkbox__input, className)}
        type="checkbox"
        name={name}
        onChange={handleChange}
        disabled={disabled}
        checked={isChecked}
      />
      <div className={styles.checkbox__box}></div>
      {alignment == 'right' && label}
    </label>
  );
}
