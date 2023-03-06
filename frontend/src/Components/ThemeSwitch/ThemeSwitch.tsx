import { Icon } from '@iconify/react';
import { putUserPreference } from '~/api';
import { useAuthContext } from '~/AuthContext';
import { THEME } from '~/constants';
import { useGlobalContext } from '~/GlobalContextProvider';
import styles from './ThemeSwitch.module.scss';

type ThemeSwitchProps = {
  className?: string;
};

export function ThemeSwitch({ className }: ThemeSwitchProps) {
  const { switchTheme, theme } = useGlobalContext();
  const { user } = useAuthContext();

  const onIcon = <Icon icon="ph:moon-stars-thin" inline={true} width={24}/>;
  const offIcon = <Icon icon="ph:sun-thin" inline={true} width={24}/>;

  function switchThemeHandler() {
    const switchedTo = switchTheme();
    if (user) {
      putUserPreference({ id: user?.user_preference.id, theme: switchedTo });
    }
  }

  return (
      <div onClick={switchThemeHandler} className={styles.button}>
        {theme === THEME.DARK ? onIcon : offIcon}
      </div>
  );
}
