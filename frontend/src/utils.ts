import i18next from 'i18next';
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
export function backgroundImageFromUrl(url?: string): CSSProperties {
  if (!url) {
    return {};
  }
  return {
    backgroundImage: `url(${url})`,
  };
}

/**
 * Function for translation object fields, such as title_nb and title_en.
 * If there is no translation for the field the common name would be given
 * @param {Record<string, unknown>}  model - The object to translate
 * @param {string} field - the field to be translated, use root of the field, such as title, name
 * @param {string} language- the language, use i18n.language for dynamic translation
 */
export function dbT(
  model: Record<string, unknown> | undefined,
  field: string,
  language: string = i18next.language,
): string | undefined {
  if (model === undefined) return undefined;

  const fieldName = field + '_' + language;
  const hasFieldName = Object.prototype.hasOwnProperty.call(model, fieldName);
  if (hasFieldName) {
    const value = model[fieldName];
    const isString = typeof value !== 'string';
    if (!isString) throw Error(`${model}: Expected string value for field ${fieldName}, value was ${value}`);
    return value as string;
  }

  const hasField = Object.prototype.hasOwnProperty.call(model, field);
  if (hasField) {
    const value = model[field];
    const isString = typeof value !== 'string';
    if (!isString) throw Error(`${model}: Expected string value for field ${field}, value was ${value}`);
    return value as string;
  }

  throw Error(`Object ${model} does not have the any of the fields '${field}' or '${fieldName}'`);
}
