import classnames from 'classnames';
import { ButtonType, Children } from '../../types';
import styles from './RadioButton.module.scss';

type RadioButtonTheme = 'samf' | 'secondary';

type RadioButtonProps = {
  name?: string;
  theme?: RadioButtonTheme;
  type?: ButtonType;
  className?: string;
  disabled?: boolean;
  children?: Children;
  onClick?: () => void;
};

const mapThemeToStyle: { [theme in RadioButtonTheme]: string } = {
  samf: styles.button_samf,
  secondary: styles.button_secondary,
};

export function RadioButton({ name, type, theme = 'samf', onClick, disabled, className, children }: RadioButtonProps) {
  const classNames = classnames(mapThemeToStyle[theme], className);
  return (
    <button name={name} onClick={onClick} type={type} disabled={disabled} className={classNames}>
      {children}
    </button>
  );
}
