import styles from './Button.module.scss';

export const buttonThemes = {
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
 * pill: Small and rounded button.
 * block: Utilizes full width.
 * rounded: Rounded button.
 */
export const buttonStyles = {
  basic: styles.display_basic,
  pill: styles.display_pill,
  block: styles.display_block,
  rounded: styles.rounded,
} as const;
