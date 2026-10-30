import type { ID } from '../types';

export const gangKeys = {
  all: ['gangs'] as const,
  organized: () => [...gangKeys.all, 'organized'] as const,

  admin: () => [...gangKeys.all, 'admin'] as const,
  adminTypes: (organizationId: ID) => [...gangKeys.admin(), 'gang-types', organizationId] as const,
};
