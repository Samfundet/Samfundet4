import { z } from 'zod';

export const NAME = z.string();

export const LOGO_FILE = z.instanceof(File).refine(
  (file) => ['image/png', 'image/jpeg', 'image/jpg', 'image/tiff', 'image/webp', 'image/gif'].includes(file.type),
  { message: 'Invalid image file type' }, // TODO: translations
);
