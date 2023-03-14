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
export type TypeValue = typeof TYPE[TypeKey];

export type Options = {
  text: string;
  url: string;
  type: TypeValue;
};

export type Applet = {
  title: string;
  perm?: string;
  icon: string;
  options: Options[];
};
