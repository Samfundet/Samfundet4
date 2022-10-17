import classnames from 'classnames';
import { Children } from '../../types';

type CheckboxTheme = 'samf';

type CheckboxProps = {
  name?: string /* Er dette rikitg props*/;
  theme?: CheckboxTheme;
  className?: string;
  disabled?: boolean;
  checked?: boolean;
  children?: Children;
  onClick?: () => void;
};

export function Checkbox({ name, onClick, disabled, className, checked }: CheckboxProps) {
  const classNames = classnames(className);
  return (
    <input type="checkbox" name={name} onClick={onClick} disabled={disabled} className={classNames} checked={checked} />
  );
}
