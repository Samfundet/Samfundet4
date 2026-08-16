export const eventKeys = {
  all: ['events'] as const,
  billig: ['billigEvents'] as const,
  lists: () => [...eventKeys.all, 'list'] as const,
  list: (filters: unknown[]) => [...eventKeys.lists(), { filters }] as const,
  paginatedLists: () => [...eventKeys.all, 'paginated'] as const,
  paginatedList: (
    page: number,
    pageSize?: number,
    filters?: { search?: string; venue?: string; category?: string; ticket_type?: string },
  ) => [...eventKeys.paginatedLists(), { page, pageSize, ...filters }] as const,
  details: () => [...eventKeys.all, 'detail'] as const,
  detail: (id: number | string) => [...eventKeys.details(), id] as const,
};
