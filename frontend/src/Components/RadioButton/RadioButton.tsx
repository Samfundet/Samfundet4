import classnames from 'classnames';
import { Children } from '../../types';
import styles from './RadioButton.module.scss';

type RadioButtonTheme = 'samf' | 'secondary';

type RadioButtonProps = {
  name?: string;
  theme?: RadioButtonTheme;
  checked?: boolean;
  className?: string;
  disabled?: boolean;
  children?: Children;
  onChange?: () => void;
};

const mapThemeToStyle: { [theme in RadioButtonTheme]: string } = {
  samf: styles.button_samf,
  secondary: styles.button_secondary,
};

export function RadioButton({ name, checked, theme = 'samf', onChange, disabled, className, children }: RadioButtonProps) {
  const classNames = classnames(mapThemeToStyle[theme], className);
  return (
    <label>
    <input type = 'radio' name={name} onChange={onChange} checked={checked} disabled={disabled} className={classNames} />
      {children}
    </label>
  );
}
