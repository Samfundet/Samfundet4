export const gangKeys = {
  all: ['gangs'] as const,
  organized: () => [...gangKeys.all, 'organized'] as const,
  lists: () => [...gangKeys.all, 'list'] as const,
  list: () => [...gangKeys.lists(), {}] as const,
};

export const adminGangKeys = {
  all: ['gangs-admin'] as const,
  types: (organizationId: number) => [...adminGangKeys.all, 'gang-types', organizationId],
  sections: (gangId: number) => [...adminGangKeys.all, 'sections', gangId],
};
