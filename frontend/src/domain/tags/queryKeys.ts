export const tagKeys = {
  all: ['tags'] as const,
  lists: () => [...tagKeys.all, 'list'] as const,
  list: () => [...tagKeys.lists(), {}] as const,
  popular: () => [...tagKeys.lists(), 'popular'] as const,
};
