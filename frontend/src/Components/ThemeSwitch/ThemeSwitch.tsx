import { Icon } from '@iconify/react';
import classnames from 'classnames';
import { useAuthContext } from '~/AuthContext';
import { useGlobalContext } from '~/GlobalContextProvider';
import { putUserPreference } from '~/api';
import { THEME } from '~/constants';
import styles from './ThemeSwitch.module.scss';

type ThemeSwitchProps = {
  className?: string;
};

export function ThemeSwitch({ className }: ThemeSwitchProps) {
  const { switchTheme, theme } = useGlobalContext();
  const { user } = useAuthContext();

  const isDarkTheme = theme === THEME.DARK;

  const onIcon = <Icon icon="ph:moon-stars-thin" inline={true} width={24} className={styles.icon} />;
  const offIcon = <Icon icon="ph:sun-thin" inline={true} width={24} className={styles.icon} />;

  function switchThemeHandler() {
    const switchedTo = switchTheme();
    if (user) {
      putUserPreference({ id: user?.user_preference.id, theme: switchedTo });
    }
  }

  return (
    <div onClick={switchThemeHandler} className={classnames(styles.button, className)}>
      {isDarkTheme ? onIcon : offIcon}
    </div>
  );
}
