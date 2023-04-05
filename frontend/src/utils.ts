import i18next from 'i18next';
import { CSSProperties } from 'react';
import { UserDto } from '~/dto';
import { KEY, KeyValues } from './i18n/constants';
import { Day } from './types';

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
    const type = typeof value;
    const isString = type === 'string';
    if (!isString)
      // throw Error(`Expected string value for field ${fieldName}, value was ${value} (${type})`);
      return undefined;
    return value as string;
  }

  const hasField = Object.prototype.hasOwnProperty.call(model, field);
  if (hasField) {
    const value = model[field];
    const type = typeof value;
    const isString = type === 'string';
    if (!isString)
      // throw Error(`Expected string value for field ${field}, value was ${value} (${type})`);
      return undefined;
    return value as string;
  }

  // This is not safe behavior if api changes or when working on a partial object.
  // Instead of failing silently, page will fail to load. Fallback to empty string.
  // throw Error(`Object ${model} does not have the any of the fields '${field}' or '${fieldName}'`);
  return undefined;
}

/** Helper to determine if a KeyValue is truthy. */
export function isTruthy(value = ''): boolean {
  const falsy = ['', 'no', 'zero', '0'];
  return !falsy.includes(value.toLowerCase());
}

/**
 * Gets the translation key for a given day
 */
export function getDayKey(day: Day): KeyValues {
  switch (day) {
    case 'monday':
      return KEY.day_monday;
    case 'tuesday':
      return KEY.day_tuesday;
    case 'wednesday':
      return KEY.day_wednesday;
    case 'thursday':
      return KEY.day_thursday;
    case 'friday':
      return KEY.day_friday;
    case 'saturday':
      return KEY.day_saturday;
    case 'sunday':
      return KEY.day_sunday;
  }
}

/**
 * Converts a UTC timestring from django to
 * a local timestring suitable for html input elements
 * @param time timestring in django utc format, eg '2028-03-31T02:33:31.835Z'
 * @returns timestamp in local format, eg. '2023-04-05T20:15'
 */
export function utcTimestampToLocal(time: string | undefined): string {
  return new Date(time ?? '')
    .toLocaleString('sv-SE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
    .replace(' ', 'T');
}
