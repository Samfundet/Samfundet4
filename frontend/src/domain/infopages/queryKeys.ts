export const infoPageKeys = {
  all: ['infopages'] as const,
  lists: () => [...infoPageKeys.all, 'list'] as const,
  list: () => [...infoPageKeys.lists(), {}] as const,
  details: () => [...infoPageKeys.all, 'detail'] as const,
  detail: (slug: string) => [...infoPageKeys.details(), slug] as const,
  // The public endpoint returns a different shape than the admin one, so they can't share a key
  public: (slug: string | undefined) => [...infoPageKeys.all, 'public', slug] as const,
  ownerOptions: () => [...infoPageKeys.all, 'owner-options'] as const,
  history: (slug: string) => [...infoPageKeys.detail(slug), 'history'] as const,
  revision: (slug: string, version: number | undefined) => [...infoPageKeys.history(slug), version] as const,
};
