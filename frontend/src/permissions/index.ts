import * as permissions from './permissions';

/**
 * Wrapper for all permissions.
 */
export const PERM = {
  ...permissions,
} as const;
