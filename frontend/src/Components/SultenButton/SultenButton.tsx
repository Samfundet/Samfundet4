import { default as classnames } from 'classnames';
import { ButtonType, Children } from '~/types';
import styles from './SultenButton.module.scss';

type ButtonTheme = 'basic' | 'samf' | 'secondary' | 'success' | 'outlined' | 'blue';
type ButtonDisplay = 'basic' | 'pill' | 'block';

type ButtonProps = {
  name?: string;
  display?: ButtonDisplay;
  type?: ButtonType;
  className?: string;
  disabled?: boolean;
  children?: Children;
  onClick?: () => void;
};

const mapDisplayToStyle: { [display in ButtonDisplay]: string } = {
  basic: styles.display_basic,
  pill: styles.display_pill,
  block: styles.display_block,
};

export function SultenButton({ name, type, display = 'pill', onClick, disabled, className, children }: ButtonProps) {
  const classNames = classnames(styles.button, mapDisplayToStyle[display], className, styles.button_basic);
  return (
    <button name={name} onClick={onClick} type={type} disabled={disabled} className={classNames}>
      {children}
    </button>
  );
}
