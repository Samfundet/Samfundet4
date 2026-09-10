export const adminGangSectionKeys = {
  all: ['gangsection-admin'] as const,
  details: () => [...adminGangSectionKeys.all, 'detail'] as const,
  detail: (slug: string) => [...adminGangSectionKeys.details(), slug] as const,
};
