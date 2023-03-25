import { CSSProperties } from 'react';
import { UserDto } from '~/dto';

export type hasPerm = {
  user: UserDto | undefined;
  permission: string;
  obj?: string | number;
};

/** Inspired by Django PermissionMixin. */
export function hasPerm({ user, permission, obj }: hasPerm): boolean {
  if (!user) {
    return false;
  }

  // Superuser always has permission.
  if (user.is_active && user.is_superuser) {
    // console.log('superuser perm');
    return true;
  }

  // Check permissions.
  const foundPermission = user.permissions?.find((perm) => perm === permission);
  if (foundPermission) {
    // console.log('permission');
    return true;
  }

  // Check object permissions.
  const foundObjectPermission = user.object_permissions?.find((object_perm) => {
    const isPermissionMatch = object_perm.permission === permission;
    const isObjMatch = object_perm.obj_pk.toString() === obj?.toString();
    return isPermissionMatch && isObjMatch;
  });
  if (foundObjectPermission) {
    // console.log('object permission');
    return true;
  }

  // Nothing found.
  return false;
}

// ------------------------------

export function getGlobalBackgroundColor(): string {
  return window.getComputedStyle(document.body, null).getPropertyValue('background-color');
}

/**
 * Function for creating a style with image url from domain
 * @param {string} url - Server relative URL (eg. /media/image.png)
 */
export function backgroundImageFromUrl(url?: string, localImage?: boolean): CSSProperties {
  if (url != null) {
    const path = localImage === true ? url : `http://localhost:8000${url}`;
    return {
      // TODO this is not safe for production, need to use absolute path
      // We should probably setup better hosting system for dev to emulate prod better
      backgroundImage: `url(${path})`,
    };
  }
  return {};
}
