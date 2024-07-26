import classnames from 'classnames';
import { THEME } from '~/constants';
import { useGlobalContext } from '~/context/GlobalContextProvider';
import { Children } from '~/types';
import styles from './PulseEffect.module.scss';

type PulseEffectProps = {
  children: Children;
  className?: string;
};

export function PulseEffect({ children, className }: PulseEffectProps) {
  const { theme } = useGlobalContext();
  const isDarkTheme = theme === THEME.DARK;
  const isLightTheme = theme === THEME.LIGHT;
  return (
    <span
      className={classnames(className, {
        [styles.ripple_theme_dark]: isDarkTheme,
        [styles.ripple_theme_light]: isLightTheme,
      })}
    >
      <span className={classnames(styles.pulse)}>{children}</span>
    </span>
  );
}
