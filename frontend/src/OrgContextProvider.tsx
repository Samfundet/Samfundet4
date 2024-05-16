import { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';
import { Children, COLORS, OrganizationTheme, OrganizationTypeValue, OrgNameType } from '~/types';

export const organizationThemes: Record<OrganizationTypeValue, OrganizationTheme> = {
  samfundet: {
    organizationName: OrgNameType.SAMFUNDET_NAME,
    pagePrimaryColor: COLORS.red_samf,
    pageSecondaryColor: COLORS.background_primary,
    buttonTheme: 'samf',
  },
  uka: {
    organizationName: OrgNameType.UKA_NAME,
    pagePrimaryColor: COLORS.blue_uka,
    pageSecondaryColor: COLORS.bisque_uka,
    buttonTheme: 'uka',
  },
  isfit: {
    organizationName: OrgNameType.ISFIT_NAME,
    pagePrimaryColor: COLORS.blue_isfit,
    pageSecondaryColor: COLORS.background_primary,
    buttonTheme: 'isfit',
  },
};

type OrganizationContextProps = {
  organizationTheme: OrganizationTheme;
  setOrganizationTheme: Dispatch<SetStateAction<OrganizationTheme>>;
  changeOrgTheme: (newThemeKey: OrganizationTypeValue) => void;
};
const OrganizationContext = createContext<OrganizationContextProps | undefined>(undefined);

export function useOrganizationContext() {
  const organizationContext = useContext(OrganizationContext);
  if (organizationContext === undefined) {
    throw new Error('useOrganizationContext must be used inside OrganizationContextProvider');
  }
  return organizationContext;
}

type OrganizationContextProviderProps = {
  enabled?: boolean;
  children: Children;
  organization?: OrganizationTypeValue;
};

export function OrganizationContextProvider({
  children,
  organization = 'samfundet',
  enabled = true,
}: OrganizationContextProviderProps) {
  const [organizationTheme, setOrganizationTheme] = useState<OrganizationTheme>(organizationThemes.samfundet);

  useEffect(() => {
    if (!enabled) {
      return;
    }
    setOrganizationTheme(organizationThemes[organization] || organizationThemes.samfundet);
  }, [enabled, organization]);

  const changeOrgTheme = (newThemeKey: OrganizationTypeValue) => {
    const newTheme = organizationThemes[newThemeKey];
    if (newTheme) {
      setOrganizationTheme(newTheme);
    }
  };

  const organizationContextValues: OrganizationContextProps = {
    organizationTheme,
    setOrganizationTheme,
    changeOrgTheme,
  };
  return <OrganizationContext.Provider value={organizationContextValues}>{children}</OrganizationContext.Provider>;
}
