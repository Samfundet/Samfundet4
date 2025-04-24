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

export const recruitmentKeys = {
  all: ['recruitment'] as const,
  lists: () => [...recruitmentKeys.all, 'list'] as const,
  list: (filters: unknown[]) => [...recruitmentKeys.lists(), { filters }] as const,
  details: () => [...recruitmentKeys.all, 'detail'] as const,
  detail: (id: number) => [...recruitmentKeys.details(), id] as const,
  availability: (id: number) => [...recruitmentKeys.detail(id), 'availability'] as const,
};

export const eventKeys = {
  all: ['events'] as const,
  lists: () => [...eventKeys.all, 'list'] as const,
  list: (filters: unknown[]) => [...eventKeys.lists(), { filters }] as const,
  details: () => [...eventKeys.all, 'detail'] as const,
  detail: (id: number) => [...eventKeys.details(), id] as const,
};

export const applicationKeys = {
  all: ['applications'] as const,
  lists: () => [...applicationKeys.all, 'list'] as const,
  list: (filters: unknown[]) => [...applicationKeys.lists(), { filters }] as const,
  details: () => [...applicationKeys.all, 'detail'] as const,
  detail: (id: number) => [...applicationKeys.details(), id] as const,
  users: (id: number) => [...applicationKeys.detail(id), 'users'] as const,
};

export const withdrawnApplicationKeys = {
  all: ['withdrawn_application'] as const,
  lists: () => [...withdrawnApplicationKeys.all, 'list'] as const,
  list: (filters: unknown[]) => [...withdrawnApplicationKeys.lists(), { filters }] as const,
  details: () => [...withdrawnApplicationKeys.all, 'detail'] as const,
  detail: (id: number) => [...withdrawnApplicationKeys.details(), id] as const,
  users: (id: number) => [...withdrawnApplicationKeys.detail(id), 'users'] as const,
};

export const interviewRoomKeys = {
  all: ['interviewroom'] as const,
  lists: () => [...interviewRoomKeys.all, 'list'] as const,
  list: (filters: unknown[]) => [...interviewRoomKeys.lists(), { filters }] as const,
  details: () => [...interviewRoomKeys.all, 'detail'] as const,
  detail: (id: number) => [...interviewRoomKeys.details(), id] as const,
};

export const recruitmentGangKeys = {
  all: ['recruitmentgangs'] as const,
  lists: () => [...recruitmentGangKeys.all, 'list'] as const,
  list: (filters: unknown[]) => [...recruitmentGangKeys.lists(), { filters }] as const,
  details: () => [...recruitmentGangKeys.all, 'detail'] as const,
  detail: (id: number) => [...recruitmentGangKeys.details(), id] as const,
};
