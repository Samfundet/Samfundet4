import { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';
import { Children, COLORS, OrganizationTheme, OrgNameType, OrgNameTypeValue } from '~/types';

export const organizationThemes: Record<OrgNameTypeValue, OrganizationTheme> = {
  [OrgNameType.SAMFUNDET_NAME]: {
    organizationName: OrgNameType.SAMFUNDET_NAME,
    pagePrimaryColor: COLORS.red_samf,
    pageSecondaryColor: COLORS.background_primary,
    buttonTheme: 'samf',
  },
  [OrgNameType.UKA_NAME]: {
    organizationName: OrgNameType.UKA_NAME,
    pagePrimaryColor: COLORS.blue_uka,
    pageSecondaryColor: COLORS.bisque_uka,
    buttonTheme: 'uka',
  },
  [OrgNameType.ISFIT_NAME]: {
    organizationName: OrgNameType.ISFIT_NAME,
    pagePrimaryColor: COLORS.blue_isfit,
    pageSecondaryColor: COLORS.background_primary,
    buttonTheme: 'isfit',
  },
  [OrgNameType.FALLBACK]: {
    organizationName: OrgNameType.SAMFUNDET_NAME,
    pagePrimaryColor: COLORS.red_samf,
    pageSecondaryColor: COLORS.background_primary,
    buttonTheme: 'samf',
  },
};

type OrganizationContextProps = {
  organizationTheme: OrganizationTheme | null;
  setOrganizationTheme: Dispatch<SetStateAction<OrganizationTheme | null>>;
  changeOrgTheme: (newThemeKey: OrgNameTypeValue) => void;
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
  organization?: OrgNameTypeValue;
};

export function OrganizationContextProvider({
  children,
  organization,
  enabled = true,
}: OrganizationContextProviderProps) {
  const [organizationTheme, setOrganizationTheme] = useState<OrganizationTheme | null>(null);

  useEffect(() => {
    if (!enabled || !organization) {
      return;
    }
    setOrganizationTheme(organizationThemes[organization]);
  }, [enabled, organization]);

  const changeOrgTheme = (newThemeKey: OrgNameTypeValue) => {
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
