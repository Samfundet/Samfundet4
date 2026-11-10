import type { InfoboxId } from './types';

export const infoboxKeys = {
  all: ['infoboxes'] as const,
  lists: () => [...infoboxKeys.all, 'list'] as const,
  list: (filters: string) => [...infoboxKeys.lists(), { filters }] as const,
  details: () => [...infoboxKeys.all, 'detail'] as const,
  detail: (id: InfoboxId) => [...infoboxKeys.details(), id] as const,
  form: (id: InfoboxId | undefined) => [...infoboxKeys.details(), id ?? null, 'form'] as const,
};
