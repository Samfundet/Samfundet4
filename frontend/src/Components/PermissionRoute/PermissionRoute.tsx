import { ProtectedRoute } from '~/Components';
import type { ProtectedRouteProps } from '~/Components/ProtectedRoute/ProtectedRoute';
import type { DistributiveOmit } from '~/types';

// Requiring permissions to view a route inherently also requires user being logged in.
// Shorten ProtectedRoute's `requirePermissions` into just `required`.
type PermissionRouteProps = DistributiveOmit<ProtectedRouteProps, 'authState' | 'requirePermissions'> & {
  required: string[];
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
 *    path="/some/path/"
 *    element={
 *      <PermissionRoute
 *        required={["some_permission"]}
 *        element={<SomePage />}
 *      />
 *    }
 * />
 * ```
 */
export function PermissionRoute({ required, ...props }: PermissionRouteProps) {
  return <ProtectedRoute authState={true} requirePermissions={required} {...props} />;
}
