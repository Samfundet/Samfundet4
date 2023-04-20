import { Icon } from '@iconify/react';
import classnames from 'classnames';
import { useGlobalContext } from '~/GlobalContextProvider';
import { useIsDarkTheme } from '~/hooks';
import styles from './ThemeSwitch.module.scss';

type ThemeSwitchProps = {
  className?: string;
};

export function ThemeSwitch({ className }: ThemeSwitchProps) {
  const { switchTheme } = useGlobalContext();
  const isDarkTheme = useIsDarkTheme();

  const onIcon = <Icon icon="ph:moon-stars-thin" inline={true} width={24} className={styles.icon} />;
  const offIcon = <Icon icon="ph:sun-thin" inline={true} width={24} className={styles.icon} />;

  return (
    <div onClick={switchTheme} className={classnames(styles.button, className)}>
      {isDarkTheme ? onIcon : offIcon}
    </div>
  );
}
