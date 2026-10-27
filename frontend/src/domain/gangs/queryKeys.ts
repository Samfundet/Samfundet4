export const gangKeys = {
  all: ['gangs'] as const,
  organized: () => [...gangKeys.all, 'organized'] as const,

  admin: () => [...gangKeys.all, 'admin'] as const,
  adminTypes: (organizationId: number) => [...gangKeys.admin(), 'gang-types', organizationId] as const,
};
