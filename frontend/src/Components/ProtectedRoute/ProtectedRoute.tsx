import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router';
import { useAuthContext } from '~/context/AuthContext';
import { ROUTES } from '~/routes';
import { hasPermissions, hasPermissionsAnywhere } from '~/utils';

type ProtectedRoutePropsBase = {
  authState: boolean; // require user to be either logged in (true) or logged out (false)
  requirePermissions?: string[] | undefined; // user must have ALL provided permissions in this list
  redirectPath?: string; // path to redirect to if auth state or permissions are not valid
  requiresStaff?: boolean; // requires user to have is_staff flag
  element: ReactNode; // If protection passes, this element is returned
};

type ProtectedRouteAnywhereResolution = ProtectedRoutePropsBase & {
  resolution: 'anywhere';
  obj?: never;
};

type ProtectedRouteBaseResolution = ProtectedRoutePropsBase & {
  resolution?: 'default' | 'roles';
  obj?: string | number;
};

export type ProtectedRouteProps = ProtectedRouteBaseResolution | ProtectedRouteAnywhereResolution;

/**
 * Router component, to be used inside element of a route, and page that is requested
 * Allows for setting up routes that requires authentication, permissions, and staff.
 *
 * This assumes auth is already loaded. If it's not, then auth will likely be null.
 *
 * `resolution` decides required permissions are checked.
 * -  'default': model-level and object-level (uses `obj`)
 * -    'roles': same as 'default', but also resolves through the role system.
 * - 'anywhere': any level (ignores `obj`)
 */
export function ProtectedRoute({
  authState,
  requirePermissions,
  obj,
  element,
  requiresStaff = false,
  redirectPath = ROUTES.frontend.home,
  resolution = 'default',
}: ProtectedRouteProps) {
  const { user } = useAuthContext();
  const location = useLocation();

  const authOk = authState === Boolean(user);
  const staffOk = !requiresStaff || Boolean(user?.is_staff);
  const permissionsOk =
    requirePermissions === undefined ||
    (resolution === 'anywhere'
      ? hasPermissionsAnywhere(user, requirePermissions)
      : hasPermissions(user, requirePermissions, obj, resolution === 'roles'));

  if (!authOk || !staffOk || !permissionsOk) {
    return <Navigate to={redirectPath} replace state={{ path: location.pathname }} />;
  }

  return element;
}
