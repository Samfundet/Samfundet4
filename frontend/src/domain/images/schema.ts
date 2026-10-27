import { z } from 'zod';

export const IMAGE_TITLE = z.string().min(1).max(140);

export const IMAGE_TAGS = z.array(z.any()).default([]);

export const IMAGE = z
  .object({
    urls: z.object({ original: z.string(), large: z.string(), medium: z.string(), small: z.string() }),
    id: z.number(),
    title: IMAGE_TITLE,
    tags: z.array(z.any()).default([]),
  })
  .passthrough();

export const OPTIONAL_IMAGE = IMAGE.optional();

export const IMAGE_FILE = z.instanceof(File).refine(
  (file) => ['image/png', 'image/jpeg', 'image/jpg', 'image/tiff', 'image/webp', 'image/gif'].includes(file.type),
  { message: 'Invalid image file type' }, // TODO: translations
);
