export const venueKeys = {
  all: ['venues'] as const,
  lists: () => [...venueKeys.all, 'list'] as const,
  list: (filters: unknown[]) => [...venueKeys.lists(), { filters }] as const,
  details: () => [...venueKeys.all, 'detail'] as const,
  detail: (slug: string) => [...venueKeys.details(), slug] as const,
  open: () => [...venueKeys.list(['open'])] as const,
};
