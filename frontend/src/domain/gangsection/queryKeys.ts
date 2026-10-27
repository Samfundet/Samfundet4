import { gangKeys } from '../gangs/queryKeys';

export const gangSectionKeys = {
  all: [...gangKeys.all, 'sections'] as const,
  details: () => [...gangSectionKeys.all, 'detail'] as const,
  detail: (id: number) => [...gangSectionKeys.details(), id] as const,

  byGangs: () => [...gangSectionKeys.all, 'gang'] as const,
  byGang: (gangId: number) => [...gangSectionKeys.byGangs(), gangId] as const,
};
