import type { Filters } from './schema';

export const eventKeys = {
  all: ['events'] as const,
  billig: ['billigEvents'] as const,
  lists: () => [...eventKeys.all, 'list'] as const,
  list: (filters?: Filters) => [...eventKeys.lists(), { filters }] as const,
  groups: () => [...eventKeys.all, 'groups'] as const,
  paginatedLists: () => [...eventKeys.all, 'paginated'] as const,
  paginatedList: (page: number, pageSize?: number, filters?: Filters) =>
    [...eventKeys.paginatedLists(), { page, pageSize, ...filters }] as const,
  details: () => [...eventKeys.all, 'detail'] as const,
  detail: (id: number | string) => [...eventKeys.details(), id] as const,
};
