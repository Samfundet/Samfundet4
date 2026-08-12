export const infoPageKeys = {
  all: ['infopages'] as const,
  details: () => [...infoPageKeys.all, 'detail'] as const,
  detail: (slug: string) => [...infoPageKeys.details(), slug] as const,
  ownerOptions: () => [...infoPageKeys.all, 'owner-options'] as const,
  history: (slug: string) => [...infoPageKeys.detail(slug), 'history'] as const,
  revision: (slug: string, version: number) => [...infoPageKeys.history(slug), version] as const,
};
