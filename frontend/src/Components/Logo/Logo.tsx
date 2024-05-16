import { IsfitLogo, SamfLogo, UkaLogo } from './components';
import { OrganizationTypeValue } from '~/types';

export type LogoPalette = {
  primary: string;
  secondary?: string;
};

export type LogoProps = {
  organization: OrganizationTypeValue;
  color: 'org-color' | 'dark' | 'light' | 'org-alt-color';
  size: 'xsmall' | 'small' | 'medium' | 'large';
};

export function Logo({ organization, color, size }: LogoProps) {
  switch (organization) {
    case 'samfundet':
      return <SamfLogo color={color} size={size} />;
    case 'uka':
      return <UkaLogo color={color} size={size} />;
    case 'isfit':
      return <IsfitLogo color={color} size={size} />;
  }
}
