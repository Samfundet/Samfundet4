import { Icon } from '@iconify/react';
import { putUserPreference } from '~/api';
import { ToggleSwitch } from '~/Components';
import { THEME } from '~/constants';
import { useGlobalContext } from '~/GlobalContextProvider';

type ThemeSwitchProps = {
  className?: string;
};

export function ThemeSwitch({ className }: ThemeSwitchProps) {
  const { switchTheme, theme, user } = useGlobalContext();

  const onIcon = <Icon icon="fluent-emoji:new-moon-face" inline={true} width={24} />;
  const offIcon = <Icon icon="fluent-emoji:sun-with-face" inline={true} width={24} />;

  function persistentSwitchTheme() {
    const switchedTo = switchTheme();
    putUserPreference({ id: user?.user_preference.id, theme: switchedTo });
  }

  return (
    <ToggleSwitch
      checked={theme === THEME.DARK}
      className={className}
      onIcon={onIcon}
      offIcon={offIcon}
      onChange={persistentSwitchTheme}
    />
  );
}
