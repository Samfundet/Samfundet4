import { Children } from '~/types';

type RadioButtonProps = {
  name?: string;
  value?: string;
  checked?: boolean;
  className?: string;
  disabled?: boolean;
  children?: Children;
  onChange?: () => void;
};

export function RadioButton({ name, value, checked, onChange, disabled, className, children }: RadioButtonProps) {
  return (
    <label>
      <input
        type="radio"
        name={name}
        value={value}
        onChange={onChange}
        checked={checked}
        disabled={disabled}
        className={className}
      />
      {children}
    </label>
  );
}
