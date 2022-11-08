import { ToggleSwitch } from '~/Components';
import { useGlobalContext } from '~/GlobalContextProvider';

type ThemeSwitchProps = {
  className?: string;
};

export function ThemeSwitch({ className }: ThemeSwitchProps) {
  const { switchTheme } = useGlobalContext();

  return <ToggleSwitch className={className} onIcon="L" offIcon="D" onClick={switchTheme} />;
}
