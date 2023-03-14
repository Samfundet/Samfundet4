import classNames from 'classnames';
import { FieldValues, UseFormRegister } from 'react-hook-form/dist/types';
import styles from './Checkbox.module.scss';

type Alignment = 'left' | 'right';

type CheckboxProps = {
  name?: string;
  label?: string;
  disabled?: boolean;
  className?: string;
  checkBoxClassName?: string;
  register?: UseFormRegister<FieldValues>;
  required?: boolean;
  checked?: boolean;
  onClick?: () => void;
  alignment?: Alignment;
};

export function Checkbox({
  name,
  onClick,
  disabled,
  checked,
  className,
  checkBoxClassName,
  alignment = 'left',
  register,
  required,
  label,
}: CheckboxProps) {
  return (
    <div className={className}>
      <label className={styles.checkbox}>
        {alignment == 'left' && label}
        <input
          className={styles.checkbox__input}
          type="checkbox"
          name={name}
          onClick={onClick}
          disabled={disabled}
          checked={checked}
          {...(register && { ...register(name, { required }) })}
        />
        <div className={classNames(styles.checkbox__box, checkBoxClassName)}></div>
        {/* Denne diven styles i .scss fil for å representere en checkbox. Input tas i input elementet over */}
        {alignment == 'right' && label}
      </label>
    </div>
  );
}
