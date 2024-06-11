import { Icon } from '@iconify/react';
import classnames from 'classnames';
import { useGlobalContext } from '~/context/GlobalContextProvider';
import { useIsDarkTheme } from '~/hooks';
import styles from './ThemeSwitch.module.scss';
import { Button } from '~/Components';

type ThemeSwitchProps = {
  className?: string;
};

export function ThemeSwitch({ className }: ThemeSwitchProps) {
  const { switchTheme } = useGlobalContext();
  const isDarkTheme = useIsDarkTheme();

  const onIcon = <Icon icon="ph:moon-stars-thin" inline={true} width={24} className={styles.icon} />;
  const offIcon = <Icon icon="ph:sun-thin" inline={true} width={24} className={styles.icon} />;

  return (
    <Button tabIndex={0} onClick={switchTheme} theme="pure" className={classnames(styles.wrapper, className)}>
      {isDarkTheme ? onIcon : offIcon}
    </Button>
  );
}
