import type { ID } from '../types';

export const imageKeys = {
  all: ['images'] as const,
  lists: () => [...imageKeys.all, 'list'] as const,
  list: (page: number, pageSize?: number, search?: string, tag?: string) =>
    [...imageKeys.lists(), { page, pageSize, search, tag }] as const,
  details: () => [...imageKeys.all, 'detail'] as const,
  detail: (id: ID | undefined) => [...imageKeys.details(), id] as const,
};
