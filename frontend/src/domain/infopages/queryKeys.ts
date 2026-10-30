import type { Slug } from '../types';

export const infoPageKeys = {
  all: ['infopages'] as const,
  lists: () => [...infoPageKeys.all, 'list'] as const,
  list: () => [...infoPageKeys.lists(), {}] as const,
  details: () => [...infoPageKeys.all, 'detail'] as const,
  detail: (slug: Slug) => [...infoPageKeys.details(), slug] as const,
  ownerOptions: () => [...infoPageKeys.all, 'owner-options'] as const,
  history: (slug: Slug) => [...infoPageKeys.detail(slug), 'history'] as const,
  revision: (slug: Slug, version: number | undefined) => [...infoPageKeys.history(slug), version] as const,
};
