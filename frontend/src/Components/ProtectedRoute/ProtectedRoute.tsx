import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router';
import { useAuthContext } from '~/context/AuthContext';
import { ROUTES } from '~/routes';
import { hasPermissions } from '~/utils';

type ProtectedRouteProps = {
  authState: boolean; // require user to be either logged in (true) or logged out (false)
  requirePermissions?: string[] | undefined; // user must have ALL provided permissions in this list
  obj?: string | number; // for permission checking
  redirectPath?: string; // path to redirect to if auth state or permissions are not valid
  requiresStaff?: boolean; // requires user to have is_staff flag
  element: ReactNode; // If protection passes, this element is returned
  resolveWithRolePermissions?: boolean; // If true, will resolve permissions with role permissions
};

/**
 * Router component, to be used inside element of a route, and page that is requested
 * Allows for setting up routes that requires authentication, permissions, and staff.
 *
 * This assumes auth is already loaded. If it's not, then auth will likely be null.
 */
export function ProtectedRoute({
  authState,
  requirePermissions,
  obj,
  element,
  requiresStaff = false,
  redirectPath = ROUTES.frontend.home,
  resolveWithRolePermissions = false,
}: ProtectedRouteProps) {
  const { user } = useAuthContext();
  const location = useLocation();

  if ((authState && !user) || (!authState && user)) {
    return <Navigate to={redirectPath} replace state={{ path: location.pathname }} />;
  }

  // TODO: Redirect to access denied page if we don't have permission. Issue #1236

  // If permissions is provided but authState=false, hasPermissions returns false, so we navigate away
  if (requirePermissions !== undefined && !hasPermissions(user, requirePermissions, obj, resolveWithRolePermissions)) {
    return <Navigate to={redirectPath} replace state={{ path: location.pathname }} />;
  }
  if (requiresStaff && !user?.is_staff) {
    return <Navigate to={redirectPath} replace state={{ path: location.pathname }} />;
  }

  return element;
}
