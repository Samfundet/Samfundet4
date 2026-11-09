import { z } from 'zod';
import { SLUG } from '../schema';

export const INFO_PAGE_TITLE = z.string().max(64);
export const INFO_PAGE_TEXT = z.string();

export const INFO_PAGE_SLUG = SLUG;
