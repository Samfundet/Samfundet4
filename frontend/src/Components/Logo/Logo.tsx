import { IsfitLogo, SamfundetLogo, UkaLogo } from './components';
import { OrgNameTypeValue } from '~/types';

export type LogoPalette = {
  primary: string;
  secondary?: string;
};

export type LogoProps = {
  organization: OrgNameTypeValue;
  color: 'org-color' | 'dark' | 'light' | 'org-alt-color';
  size: 'xsmall' | 'small' | 'medium' | 'large';
};

export function Logo({ organization, color, size }: LogoProps) {
  switch (organization) {
    case 'Samfundet':
      return <SamfundetLogo color={color} size={size} />;
    case 'UKA':
      return <UkaLogo color={color} size={size} />;
    case 'ISFiT':
      return <IsfitLogo color={color} size={size} />;
  }
}
