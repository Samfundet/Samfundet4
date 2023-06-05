import styles from './Checkbox.module.scss';

type Alignment = 'left' | 'right';

type CheckboxProps = {
  name?: string;
  label?: string;
  disabled?: boolean;
  checked?: boolean;
  onClick?: () => void;
  alignment?: Alignment;
};

export function Checkbox({ name, onClick, disabled, checked, alignment = 'left', label }: CheckboxProps) {
  return (
    <label className={styles.checkbox}>
      {alignment == 'left' && label}
      <input
        className={styles.checkbox__input}
        type="checkbox"
        name={name}
        onClick={onClick}
        disabled={disabled}
        checked={checked}
      />
      <div className={styles.checkbox__box}></div>
      {alignment == 'right' && label}
    </label>
  );
}
