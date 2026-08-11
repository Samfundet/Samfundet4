export const imageKeys = {
  all: ['images'] as const,
  lists: () => [...imageKeys.all, 'list'] as const,
  list: (page: number, search?: string, tag?: string) => [...imageKeys.lists(), { page, search, tag }] as const,
  details: () => [...imageKeys.all, 'detail'] as const,
  detail: (id: number) => [...imageKeys.details(), id] as const,
};
