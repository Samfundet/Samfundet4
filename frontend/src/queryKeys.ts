export const roleKeys = {
  all: ['roles'] as const,
  lists: () => [...roleKeys.all, 'list'] as const,
  list: (filters: unknown[]) => [...roleKeys.lists(), { filters }] as const,
  details: () => [...roleKeys.all, 'detail'] as const,
  detail: (id: number) => [...roleKeys.details(), id] as const,
  users: (id: number) => [...roleKeys.detail(id), 'users'] as const,
};

export const infoPageKeys = {
  all: ['infopages'] as const,
  lists: () => [...infoPageKeys.all, 'list'] as const,
  list: (filters: unknown[]) => [...infoPageKeys.lists(), { filters }] as const,
  details: () => [...infoPageKeys.all, 'detail'] as const,
  detail: (slug: string) => [...infoPageKeys.details(), slug] as const,
};

export const permissionKeys = {
  all: ['permissions'] as const,
  lists: () => [...permissionKeys.all, 'list'] as const,
  list: (filters: unknown[]) => [...permissionKeys.lists(), { filters }] as const,
  details: () => [...permissionKeys.all, 'detail'] as const,
  detail: (id: number) => [...permissionKeys.details(), id] as const,
};

export const billigEventKeys = {
  all: ['billigEvent'] as const,
  lists: () => [...billigEventKeys.all, 'list'] as const,
  list: (filters: unknown[]) => [...billigEventKeys.lists(), { filters }] as const,
  details: () => [...billigEventKeys.all, 'detail'] as const,
  detail: (id: number) => [...billigEventKeys.details(), id] as const,
};

export const billigTicketGroupKeys = {
  all: ['billigTicketGroup'] as const,
  lists: () => [...billigTicketGroupKeys.all, 'list'] as const,
  list: (filters: unknown[]) => [...billigTicketGroupKeys.lists(), { filters }] as const,
  details: () => [...billigTicketGroupKeys.all, 'detail'] as const,
  detail: (id: number) => [...billigTicketGroupKeys.details(), id] as const,
};

export const billigPriceGroupKeys = {
  all: ['billigPriceGroup'] as const,
  lists: () => [...billigPriceGroupKeys.all, 'list'] as const,
  list: (filters: unknown[]) => [...billigPriceGroupKeys.lists(), { filters }] as const,
  details: () => [...billigPriceGroupKeys.all, 'detail'] as const,
  detail: (id: number) => [...billigPriceGroupKeys.details(), id] as const,
};
