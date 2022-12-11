import { GroupDto, PermissionDto, UserDto } from '~/dto';

/** Inspired by Django PermissionMixin. */
export function permissionToString(permission: PermissionDto): string {
  return `${permission.content_type.app_label}.${permission.codename}`;
}

// ------------------------------

export type groupHasPerm = {
  group: GroupDto;
  permission: string;
  obj?: unknown;
};

/** Inspired by Django PermissionMixin. */
export function groupHasPerm({ group, permission }: groupHasPerm): boolean {
  const foundPerm = group.permissions?.find((perm) => permissionToString(perm) === permission);
  if (foundPerm) {
    return true;
  }
  return false;
}

// ------------------------------

export type hasPerm = {
  user: UserDto;
  permission: string;
  obj?: { id: string; model: string; app_label: string };
  // obj?: { id: string; contentType: ContentTypeDto };
};

/** Inspired by Django PermissionMixin. */
export function hasPerm({ user, permission, obj }: hasPerm): boolean {
  // Superuser always has permission.
  if (user.is_active && user.is_superuser) {
    // console.log('superuser perm');
    return true;
  }

  // Check user permissions.
  const foundUserPermission = user.user_permissions?.find((perm) => permissionToString(perm) === permission);
  // Superuser always has permission.
  if (foundUserPermission) {
    // console.log('user perm');
    return true;
  }

  // Check group permissions.
  const foundGroupPermission = user.groups.find((group) =>
    group.permissions?.find((perm) => permissionToString(perm) === permission),
  );
  if (foundGroupPermission) {
    // console.log('group perm');
    return true;
  }

  // Check user object perms.
  const foundUserObjectPerm = user.user_object_perms?.find(
    (uop) =>
      permissionToString(uop.permission) === permission &&
      uop.obj_id === obj?.id &&
      uop.content_type.model === obj.model &&
      uop.content_type.app_label === obj.app_label,
  );
  if (foundUserObjectPerm) {
    // console.log('user object perm');
    return true;
  }

  // Check group object perms.
  const foundGroupObjectPerm = user.groups.find((gops) =>
    gops.group_object_perms?.find(
      (gop) =>
        permissionToString(gop.permission) === permission &&
        gop.obj_id === obj?.id &&
        gop.content_type.model === obj.model &&
        gop.content_type.app_label === obj.app_label,
    ),
  );
  if (foundGroupObjectPerm) {
    // console.log('group object perm');
    return true;
  }

  // Nothing found.
  return false;
}

// ------------------------------

export function getGlobalBackgroundColor(): string {
  return window.getComputedStyle(document.body, null).getPropertyValue('background-color');
}
