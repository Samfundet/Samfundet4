import type { ID } from '../types';
import type { EventFilters } from './types';

export const eventKeys = {
  all: ['events'] as const,
  lists: () => [...eventKeys.all, 'list'] as const,
  list: () => [...eventKeys.lists(), {}] as const,
  details: () => [...eventKeys.all, 'detail'] as const,
  detail: (id: ID | undefined) => [...eventKeys.details(), id] as const,

  upcomings: () => [...eventKeys.all, 'upcoming'] as const,
  perDay: () => [...eventKeys.upcomings(), 'per-day'] as const,
  upcomingPaginateds: () => [...eventKeys.upcomings(), 'paginated'] as const,
  upcomingPaginated: (page: number, pageSize?: number, filters?: EventFilters) =>
    [...eventKeys.upcomingPaginateds(), { page, pageSize, filters }] as const,

  groups: () => [...eventKeys.all, 'group'] as const,
  group: (id: ID) => [...eventKeys.groups(), id] as const,

  clones: () => [...eventKeys.all, 'clone'] as const,
  clone: (id: ID | undefined) => [...eventKeys.clones(), id] as const,
};

export const billigKeys = {
  all: ['billigEvents'] as const,
};
