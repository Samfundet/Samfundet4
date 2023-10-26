import classNames from 'classnames';
import styles from './Button.module.scss';
import { ButtonDisplay, ButtonTheme } from './types';

export const mapThemeToStyle: { [theme in ButtonTheme]: string } = {
  basic: styles.button_basic,
  pure: styles.pure,
  samf: styles.button_samf,
  secondary: styles.button_secondary,
  success: styles.button_success,
  outlined: classNames(styles.button_outlined, 'button_outlined'), // Must be globally available for theme-dark.
  blue: styles.button_blue,
  black: styles.button_black,
  white: styles.button_white,
  green: styles.button_green,
  cat: styles.button_cat,
};

export const mapDisplayToStyle: { [display in ButtonDisplay]: string } = {
  basic: styles.display_basic,
  pill: styles.display_pill,
  block: styles.display_block,
};
