import styles from './Button.module.scss';

export const themeToStyleMap = {
  primary: styles.button_primary,
  secondary: styles.button_secondary,
  success: styles.button_success,
  danger: styles.button_danger,
  ghost: styles.button_ghost,

  // Color-specific
  black: styles.button_black,
  white: styles.button_white,
  blue: styles.button_blue,

  // Special buttons
  uka: styles.button_uka,
  isfit: styles.button_isfit,
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
