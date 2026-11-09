export const gangKeys = {
  all: ['gangs'] as const,
  organized: () => [...gangKeys.all, 'organized'] as const,

  admin: () => [...gangKeys.all, 'admin'] as const,
  adminDetails: () => [...gangKeys.admin(), 'detail'] as const,
  adminDetail: (id: string | number | undefined) => [...gangKeys.adminDetails(), id] as const,
  adminTypes: (organizationId: string | number) => [...gangKeys.admin(), 'gang-types', organizationId] as const,
};
