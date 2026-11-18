import { useAuthContext } from '~/context/AuthContext';
import { hasPerm } from '~/utils';

/**
 * Shorthand to check if current user has a given permission.
 */
export function usePermission(permission: string, obj?: string | number): boolean {
  const { user } = useAuthContext();
  const hasPermission = hasPerm({ permission: permission, user: user, obj: obj });
  return hasPermission;
}
