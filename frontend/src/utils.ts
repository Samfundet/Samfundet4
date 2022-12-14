import { UserDto } from '~/dto';
import { FieldValues, UseFormSetValue } from 'react-hook-form/dist/types';

export type hasPerm = {
  user: UserDto | undefined;
  permission: string;
  obj: string | number;
};

/** Inspired by Django PermissionMixin. */
export function hasPerm({ user, permission, obj }: hasPerm): boolean {
  // Superuser always has permission.

  if (!user) {
    return false;
  }
  if (user.is_active && user.is_superuser) {
    // console.log('superuser perm');
    return true;
  }

  // Check permissions.
  const foundPermission = user.permissions?.find((perm) => perm === permission);
  // Superuser always has permission.
  if (foundPermission) {
    // console.log('permission');
    return true;
  }

  // Check object permissions.
  const foundObjectPermission = user.object_permissions?.find((object_perm) => {
    const isPermissionMatch = object_perm.permission === permission;
    const isObjMatch = object_perm.obj_pk.toString() === obj.toString();
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
 * Function for converting JSONDTOData into values accepted by a HTML Form in ReactHookFormFormat
 * Data is set into a reacthookform and returns nothing
 * @param {Record<string, unknown>}  data - The DTO Data
 * @param {UseFormSetValue<FieldValues>} setValue - Function for setting the data into a ReactHookForm
 * @param {string[]} ignore - List of keys in the data to ignore converting
 */
export function DTOToForm(
  data: Record<string, unknown>,
  setValue: UseFormSetValue<FieldValues>,
  ignore: string[],
): void {
  // TODO May need adding more forms of converting, now only accepts integers, strings and datetimes
  for (const v in data) {
    if (!(v in ignore)) {
      if (new Date(data[v]).getTime() > 0) {
        // Checks if data is string
        setValue(v, new Date(data[v]).toISOString().slice(0, 16));
      } else if (Number.isInteger(data[v])) {
        // Check if data is a integer
        setValue(v, parseInt(data[v]));
      } else setValue(v, data[v]);
    }
  }
}
