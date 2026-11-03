import { gangKeys } from '../gangs/queryKeys';

export const gangSectionKeys = {
  all: [...gangKeys.all, 'sections'] as const,
  details: () => [...gangSectionKeys.all, 'detail'] as const,
  detail: (id: string | number) => [...gangSectionKeys.details(), id] as const,

  byGangs: () => [...gangSectionKeys.all, 'gang'] as const,
  byGang: (id: string | number) => [...gangSectionKeys.byGangs(), id] as const,
};
