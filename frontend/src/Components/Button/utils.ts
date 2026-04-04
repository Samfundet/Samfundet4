import classNames from 'classnames';
import styles from './Button.module.scss';

export const themeToStyleMap = {
  primary: styles.button_primary,
  secondary: styles.button_secondary,
  success: styles.button_success,
  danger: styles.button_danger,
  ghost: styles.button_ghost,
  black: styles.button_black,
  white: styles.button_white,

  // Special buttons
  uka: styles.button_uka,
  isfit: styles.button_isfit,

  // TODO: Old styles, to be removed.
  basic: styles.button_basic,
  selected: styles.button_selected,
  pure: styles.pure,
  text: styles.button_text,
  samf: styles.button_samf,
  outlined: classNames(styles.button_outlined, 'button_outlined'), // Must be globally available for theme-dark.
  blue: styles.button_blue,
  green: styles.button_green,
} as const;

/**
 * basic: Normal button wrapping text.
 * pill: Rounded button.
 * block: Utilizes full width.
 */
export const displayToStyleMap = {
  basic: styles.display_basic,
  pill: styles.display_pill,
  block: styles.display_block,
} as const;
