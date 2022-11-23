import { Icon } from '@iconify/react';
import { ToggleSwitch } from '~/Components';
import { useGlobalContext } from '~/GlobalContextProvider';

type ThemeSwitchProps = {
  className?: string;
};

export function ThemeSwitch({ className }: ThemeSwitchProps) {
  const { switchTheme } = useGlobalContext();

  const onIcon = <Icon icon="fluent-emoji:new-moon-face" inline={true} width={24} />;
  const offIcon = <Icon icon="fluent-emoji:sun-with-face" inline={true} width={24} />;

  return <ToggleSwitch className={className} onIcon={onIcon} offIcon={offIcon} onClick={switchTheme} />;
}
