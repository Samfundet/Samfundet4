import classNames from 'classnames';
import styles from './Checkbox.module.scss';

type Alignment = 'left' | 'right';

export type CheckboxProps = {
  name?: string;
  label?: string;
  disabled?: boolean;
  checked?: boolean;
  alignment?: Alignment;
  className?: string;
  onChange?: (...event: unknown[]) => void;
  error?: string | boolean;
  value?: boolean;
};

// TODO: Add error handling, eg. display red text when error is set
export function Checkbox({ name, disabled, checked, className, alignment = 'left', label, onChange }: CheckboxProps) {
  return (
    <label className={styles.checkbox}>
      {alignment == 'left' && label}
      <input
        className={classNames(styles.checkbox__input, className)}
        type="checkbox"
        name={name}
        onChange={onChange}
        disabled={disabled}
        checked={checked}
      />
      <div className={styles.checkbox__box}></div>
      {alignment == 'right' && label}
    </label>
  );
}
