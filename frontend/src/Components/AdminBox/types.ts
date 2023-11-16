export const TYPE = {
  ADD: 'ADD',
  MANAGE: 'MANAGE',
  EDIT: 'EDIT',
  STEAL: 'STEAL',
  INFO: 'INFO',
  KILROY: 'KILROY',
} as const;

export type Type = typeof TYPE;
export type TypeKey = keyof Type;
export type TypeValue = (typeof TYPE)[TypeKey];

export type Options = {
  text: string;
  url: string;
  type: TypeValue;
};

/**  One category of applets (e.g. general, admission) */
export type AppletCategory = {
  title_en: string;
  title_nb: string;
  applets: Applet[];
};

/** An admin applet */
export type Applet = {
  title_en: string;
  title_nb: string;
  perm?: string;
  icon: string;
  url?: string;
};
