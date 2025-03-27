import type { ReactNode } from 'react';
import { ProtectedRoute } from '~/Components';

/**
 * Props for the PermissionRoute component, which is used to render a route
 * based on specific permission requirements.
 *
 * @property {string[]} [requiredPermissions] - An optional array of permissions
 * that are required to access the route.
 * @property {boolean} [resolveWithRolePermissions] - An optional flag indicating
 * whether to resolve permissions using role-based permissions.
 * @property {string | number} [obj] - An optional object identifier, is used
 * to check object-level permissions, not resolved by role-based permissions.
 * @property {boolean} [requiresStaff] - An optional flag indicating whether the
 * route requires the user to have staff-level permissions.
 * @property {ReactNode} element - The React element to render if the permission
 * requirements are met.
 */
type PermissionRouteProps = {
  requiredPermissions?: string[];
  resolveWithRolePermissions?: boolean;
  obj?: string | number;
  requiresStaff?: boolean;
  element: ReactNode;
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
export function PermissionRoute({
  element,
  requiredPermissions,
  obj,
  requiresStaff,
  resolveWithRolePermissions = false,
}: PermissionRouteProps) {
  return (
    <ProtectedRoute
      authState={true}
      requirePermissions={requiredPermissions}
      requiresStaff={requiresStaff}
      obj={obj}
      element={element}
      resolveWithRolePermissions={resolveWithRolePermissions}
    />
  );
}
