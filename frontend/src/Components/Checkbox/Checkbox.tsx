import classnames from 'classnames';
/*import { CheckboxType, Children } from '../../types';*/
import { Children } from '../../types';
import styles from './Checkbox.module.scss';

type CheckboxTheme = 'samf' | 'secondary';

type CheckboxProps = {
  name?: string /* Er dette rikitg props*/;
  theme?: CheckboxTheme;
  /*type?: CheckboxType;*/
  className?: string;
  disabled?: boolean;
  children?: Children;
  onClick?: () => void;
};

const mapThemeToStyle: { [theme in CheckboxTheme]: string } = {
  samf: styles.checkbox_samf,
  secondary: styles.checkbox_secondary,
};

export function Checkbox({ name, theme = 'samf', onClick, disabled, className }: CheckboxProps) {
  /* Er dette rikitg props*/
  const classNames = classnames(mapThemeToStyle[theme], className);
  return <input type="checkbox" name={name} onClick={onClick} disabled={disabled} className={classNames} />;
}
