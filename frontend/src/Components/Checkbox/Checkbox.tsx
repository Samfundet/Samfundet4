import classnames from 'classnames';
import { Children } from '../../types';

type Alignment = 'left' | 'right';

type CheckboxProps = {
  name?: string;
  className: string;
  disabled: boolean;
  checked: boolean;
  children?: Children;
  onClick?: () => void;
  alignment?: Alignment;
};

export function Checkbox({ name, onClick, disabled, className, checked, children, alignment = 'left' }: CheckboxProps) {
  const classNames = classnames(className);
  return (
    <label>
      {alignment == 'left' ? children : ''}
      <input
        type="checkbox"
        name={name}
        onClick={onClick}
        disabled={disabled}
        className={classNames}
        checked={checked}
      />
      {alignment == 'right' ? children : ''}
    </label>
  );
}
