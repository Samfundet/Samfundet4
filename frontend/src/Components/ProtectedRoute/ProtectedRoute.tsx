// import { Navigate, useLocation } from 'react-router-dom';
// import { useAuthContext } from '~/context/AuthContext';
// import { hasPerm } from '~/utils';
// import { ROUTES } from '~/routes';
import { ElementType } from 'react';
import { ROUTES } from '~/routes';

type ProtectedRouteProps = {
  Page: ElementType;
  perms?: string[] | undefined;
  redirectPath?: string;
  requiresStaff?: boolean;
};

/**
 * Router component, to be used inside element of a route, and page that is requested
 * Allows for setting up routes that requires authentication, permissions, and staff
 * @param {ElementType} Page - The page to be rendered
 * @param {UserDto | undefined} user - the current user, undefined if not logged in
 * @param {string[] | undefined} perms - list of permissions needed to access page, undefined if not needed
 * @param {string} redirectPath - redirect to specific page if wanted
 * @param {boolean} requiresStaff: - if staff permissions are required for page
 */

/* eslint-disable @typescript-eslint/no-unused-vars */

export function ProtectedRoute({
  Page,
  perms,
  redirectPath = ROUTES.frontend.home, // TODO ADD 403?
  requiresStaff = false,
}: ProtectedRouteProps) {
  return <Page />;

  // TODO: fix
  // const location = useLocation();
  // const { user } = useAuthContext(); //TODO ADD LOADER FOR AUTHCONTEXT

  // if (!user) {
  //   return <Navigate to={ROUTES.frontend.login} replace state={{ from: location }} />;
  // }
  // if (requiresStaff && !user?.is_staff) {
  //   return <Navigate to={redirectPath} replace />; // Replace replace current navigation head instead of pushing it
  // }
  // if (perms) {
  //   for (const permission of perms) {
  //     if (!hasPerm({ permission: permission, user: user })) {
  //       return <Navigate to={redirectPath} replace />;
  //     }
  //   }
  // }
  // return <Page />;
}
