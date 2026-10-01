import type { Filters } from './queries';

// to invalidate upcoming and paginated, pass the key without any filters
export const eventKeys = {
  all: ['events'] as const,
  details: () => [...eventKeys.all, 'detail'] as const,
  detail: (id: number | string) => [...eventKeys.details(), id] as const,
  upcoming: (filters?: Filters) => [...eventKeys.all, 'upcoming', { filters }] as const,
  perDay: () => [...eventKeys.upcoming(), 'per-day'] as const,
  paginated: (page: number, pageSize?: number, filters?: Filters) =>
    [...eventKeys.upcoming(filters), 'paginated', { page, pageSize }] as const,
  groups: () => [...eventKeys.all, 'group'] as const,
  group: (id: number | string) => [...eventKeys.groups(), id] as const,
};

export const eventCloneKeys = {
  all: ['event-clone'] as const,
  details: () => [...eventCloneKeys.all, 'detail'] as const,
  detail: (id: string | number) => [...eventCloneKeys.details(), id] as const,
};

export const billigKeys = {
  all: ['billigEvents'] as const,
};
