import type { EventId, Filters } from './types';

export const eventKeys = {
  all: ['events'] as const,
  details: () => [...eventKeys.all, 'detail'] as const,
  detail: (id: EventId) => [...eventKeys.details(), id] as const,

  upcomings: () => [...eventKeys.all, 'upcoming'] as const,
  perDay: () => [...eventKeys.upcomings(), 'per-day'] as const,
  upcomingPaginateds: () => [...eventKeys.upcomings(), 'paginated'] as const,
  upcomingPaginated: (page: number, pageSize?: number, filters?: Filters) =>
    [...eventKeys.upcomingPaginateds(), { page, pageSize, filters }] as const,

  groups: () => [...eventKeys.all, 'group'] as const,
  group: (id: EventId) => [...eventKeys.groups(), id] as const,

  clones: () => [...eventKeys.all, 'clone'] as const,
  clone: (id: EventId) => [...eventKeys.clones(), id] as const,
};

export const billigKeys = {
  all: ['billigEvents'] as const,
};
