import i18next from 'i18next';
import { CSSProperties } from 'react';
import { CURSOR_TRAIL_CLASS, THEME_KEY, ThemeValue } from '~/constants';
import { UserDto } from '~/dto';
import { KEY, KeyValues } from './i18n/constants';
import { Day, EventTicketType, EventTicketTypeValue } from './types';
import { format } from 'date-fns';

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
      return KEY.common_day_monday;
    case 'tuesday':
      return KEY.common_day_tuesday;
    case 'wednesday':
      return KEY.common_day_wednesday;
    case 'thursday':
      return KEY.common_day_thursday;
    case 'friday':
      return KEY.common_day_friday;
    case 'saturday':
      return KEY.common_day_saturday;
    case 'sunday':
      return KEY.common_day_sunday;
  }
}

/**
 * Gets the translation key for a given price group
 */
export function getTicketTypeKey(ticketType: EventTicketTypeValue): KeyValues {
  switch (ticketType) {
    case EventTicketType.FREE:
      return KEY.common_ticket_type_free;
    case EventTicketType.INCLUDED:
      return KEY.common_ticket_type_included;
    case EventTicketType.BILLIG:
      return KEY.common_ticket_type_billig;
    case EventTicketType.CUSTOM:
      return KEY.common_ticket_type_custom;
    case EventTicketType.REGISTRATION:
      return KEY.common_ticket_type_registration;
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

/**
 * Converts a UTC timestring from django to
 * a finer time
 * @param time timestring in django utc format, eg '2028-03-31T02:33:31.835Z'
 * @returns timestamp in local format, eg. '2023-04-05T20:15'
 */
export function niceDateTime(time: string | undefined): string | undefined {
  const date = new Date(time ?? '');
  if (!isNaN(date.getTime())) {
    const dateString = date.toUTCString();
    return dateString.substring(0, dateString.length - 3);
  }
  return time;
}

export function formatDateYMD(d: Date): string {
  return format(d, 'yyyy.LL.dd');
}

/**
 * Generic query function for DTOs. Returns elements from array matching query.
 * @param query String query to search with
 * @param elements Array of DTO elements
 * @param fields Fields in DTOs to search agains (eg. title_nb, title_en)
 * @returns Array of DTO elements matching query
 */
export function queryDto<T extends Record<string, unknown>>(query: string, elements: T[], fields: string[]): T[] {
  if (query === '') return elements;
  // Split keywords
  const keywords = query.toLowerCase().split(' ');
  return elements.filter((element: T) => {
    // Build combined string based on fields
    let combinedString = '';
    for (const field of fields) {
      // Add string fields
      if (typeof element[field] === 'string') {
        combinedString += ` ${(element[field] as string).toLowerCase()}`;
      } else {
        console.warn(`queryDto tried to query field '${field}' which is not string type`);
      }
    }
    // Return true if all keywords are included
    return keywords.reduce((othersOK, keyword) => othersOK && combinedString.includes(keyword), true);
  });
}

/**
 * Custom DTO query where a function is used to convert element to searchable string
 * @param query String query to search with
 * @param elements Array of DTO elements
 * @param toStringRepresentation Function that converts DTO to a searchable string
 * @returns Array of DTO elements matching query
 */
export function queryDtoCustom<T extends Record<string, unknown>>(
  query: string,
  elements: T[],
  toStringRepresentation: (v: T) => string,
): T[] {
  if (query === '') return elements;
  const keywords = query.toLowerCase().split(' ');
  return elements.filter((element: T) => {
    // Build combined string based on fields
    const combinedString = toStringRepresentation(element).toLowerCase();
    // Return true if all keywords are included
    return keywords.reduce((othersOK, keyword) => othersOK && combinedString.includes(keyword), true);
  });
}

/**
 * Function to change the theme.
 */
export function updateBodyThemeClass(theme: ThemeValue): void {
  // Set theme as data attr on body.
  document.body.setAttribute(THEME_KEY, theme);
  // Remember theme in localStorage between refreshes.
  localStorage.setItem(THEME_KEY, theme);
}

/**
 * Helper to create element, add class, position the element and add to body.
 */
export function createDot(e: MouseEvent): HTMLDivElement {
  //
  const dot = document.createElement('div');
  dot.classList.add(CURSOR_TRAIL_CLASS); // global.scss
  dot.style.left = e.clientX + window.pageXOffset + 'px';
  dot.style.top = e.clientY + window.pageYOffset + 'px';
  return dot;
}

/**
 * Lowercases the string, then capitalizes the first word.
 * Example: 'lorem ipsum Dolor' becomes 'Lorem ipsum dolor'
 */
export function lowerCapitalize(s: string): string {
  if (s.length < 2) {
    return s.toUpperCase();
  }
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

/**
 * Method for fetching Random entry from list
 */
export function getRandomEntryFromList(entries: unknown[]): unknown {
  return entries[Math.floor(Math.random() * entries.length)];
}

/**
 * Fetches an datetime object from time
 * Example: '13:00' becomes a dateobject with time 13:00:00
 */
export function getTimeObject(time: string): number {
  const timeSplit = time.split(':');
  return new Date().setHours(parseInt(timeSplit[0]), parseInt(timeSplit[1]), 0, 0);
}
