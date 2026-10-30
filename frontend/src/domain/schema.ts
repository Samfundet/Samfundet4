import { z } from 'zod';
import { KEY } from '~/i18n/constants';

export const IMAGE_FILE = z
  .instanceof(File)
  .refine(
    (file) => ['image/png', 'image/jpeg', 'image/jpg', 'image/tiff', 'image/webp', 'image/gif'].includes(file.type),
    { message: KEY.error_invalid_image_file_type },
  );

export const SLUG = z
  .string()
  .min(2)
  .max(64)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, KEY.error_invalid_slug);
