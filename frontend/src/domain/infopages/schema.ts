import { z } from 'zod';
import { KEY } from '~/i18n/constants';

export const INFO_PAGE_TITLE = z.string().max(64);
export const INFO_PAGE_TEXT = z.string();

export const INFO_PAGE_SLUG = z
  .string()
  .min(2)
  .max(64)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, KEY.error_invalid_slug);
