import classNames from 'classnames';
import styles from './Button.module.scss';

export const themeToStyleMap = {
  basic: styles.button_basic,
  pure: styles.pure,
  text: styles.button_text,
  samf: styles.button_samf,
  lyche: styles.button_lyche,
  secondary: styles.button_secondary,
  success: styles.button_success,
  outlined: classNames(styles.button_outlined, 'button_outlined'), // Must be globally available for theme-dark.
  blue: styles.button_blue,
  black: styles.button_black,
  white: styles.button_white,
  green: styles.button_green,
  yellow: styles.button_yellow,
} as const;

/**
 * basic: Normal button wrapping text.
 * pill: Rounded button.
 * block: Utilises full width.
 */
export const displayToStyleMap = {
  basic: styles.display_basic,
  pill: styles.display_pill,
  block: styles.display_block,
} as const;
