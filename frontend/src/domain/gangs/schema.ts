import { z } from 'zod';
import { INFO_PAGE_SLUG } from '~/domain/infopages/schema';

export const LOGO_FILE = z.instanceof(File).refine(
  (file) => ['image/png', 'image/jpeg', 'image/jpg', 'image/tiff', 'image/webp', 'image/gif'].includes(file.type),
  { message: 'Invalid image file type' }, // TODO: translations
);

export const NAME = z.string();

export const ABBREVIATION = z.string();

export const GANG_INFO_PAGE = INFO_PAGE_SLUG;

export const GANG_TYPE = z.number();
