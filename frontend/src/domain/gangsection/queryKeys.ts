import { gangKeys } from '../gangs/queryKeys';
import type { ID } from '../types';

export const gangSectionKeys = {
  all: [...gangKeys.all, 'sections'] as const,
  details: () => [...gangSectionKeys.all, 'detail'] as const,
  detail: (id: ID) => [...gangSectionKeys.details(), id] as const,

  byGangs: () => [...gangSectionKeys.all, 'gang'] as const,
  byGang: (id: ID) => [...gangSectionKeys.byGangs(), id] as const,
};
