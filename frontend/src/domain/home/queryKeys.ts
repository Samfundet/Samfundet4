import { eventKeys } from '../events/queryKeys';

// Home relies on events so it needs to build on top of
// eventKeys for invalidation purposes
export const homeKeys = {
  all: [...eventKeys.all, 'home'] as const,
};
