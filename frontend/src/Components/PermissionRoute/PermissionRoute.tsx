import { ProtectedRoute } from '~/Components';
import type { ReactNode } from 'react';

type PermissionRouteProps = {
  required?: string[];
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
export function PermissionRoute({ element, required, obj, requiresStaff }: PermissionRouteProps) {
  return (
    <ProtectedRoute
      authState={true}
      requirePermissions={required}
      requiresStaff={requiresStaff}
      obj={obj}
      element={element}
    />
  );
}
