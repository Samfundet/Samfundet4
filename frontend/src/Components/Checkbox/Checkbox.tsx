import classNames from 'classnames';
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
      {/* <div className={disabled ? styles.checkbox__disabled : styles.checkbox__box}></div> */}
      <div className={classNames(styles.checkbox__box, disabled && styles.checkbox__disabled)}></div>
      {/* Denne diven styles i .scss fil for å representere en checkbox. Input tas i input elementet over */}
      {alignment == 'right' && label}
    </label>
  );
}
