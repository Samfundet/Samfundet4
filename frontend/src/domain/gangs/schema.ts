import { z } from 'zod';
import { IMAGE_FILE, SLUG } from '../schema';

export const GANG_LOGO_FILE = IMAGE_FILE;

export const GANG_NAME = z.string();

export const GANG_ABBREVIATION = z.string();

export const GANG_INFO_PAGE = SLUG;

export const GANG_TYPE = z.number();
