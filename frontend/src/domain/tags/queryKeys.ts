import { imageKeys } from '../images/queryKeys';

// Tags extend imageKeys, so when images is invalidated
// then tags are also invalidated.
export const tagKeys = {
  all: [...imageKeys.all, 'tags'] as const,
  lists: () => [...tagKeys.all, 'list'] as const,
  list: () => [...tagKeys.lists(), {}] as const,
  popular: () => [...tagKeys.lists(), 'popular'] as const,
};
