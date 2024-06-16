import { useAuthContext } from '~/context/AuthContext';
import { AccessDenied } from '~/Components';
import { Children } from '~/types';
import { hasPerm } from '~/utils';

type PermissionRouteProps = {
  permission: string;
  obj?: string | number;
  children: Children;
};

/**
 * react-router-dom requires that all children of a Router are of type `Route`.
 * This component may be used within a Route to wrap content.
 *
 * PermissionRoute will enforce that an authenticated user has permission to
 * view said content given a permission (and optionally an obj).
 *
 * Example:
 * ```ts
 * <Route
 *    path={'some/path/'}
 *    element={
 *      <PermissionRoute
 *        permission='view_something_permission'
 *          <SomePage />
 *      <PermissionRoute />
 *    }
 * />
 * ```
 */
export function PermissionRoute({ permission, obj, children }: PermissionRouteProps) {
  const { user } = useAuthContext();
  const hasPermission = hasPerm({ user, permission, obj });
  return hasPermission ? <>{children}</> : <AccessDenied />;
}
