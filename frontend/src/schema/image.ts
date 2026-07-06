import { z } from 'zod';

export const TITLE = z.string().min(1).max(140);

export const TAGS = z.array(z.any()).default([]);

export const TAG = z.object({ name: z.string(), color: z.string(), id: z.number() });

export const OPTIONAL_TAG = TAG.optional();

export const IMAGE = z
  .object({
    urls: z.object({ original: z.string(), large: z.string(), medium: z.string(), small: z.string() }),
    id: z.number(),
    title: TITLE,
    tags: z.array(z.any()).default([]),
  })
  .passthrough();

export const OPTIONAL_IMAGE = IMAGE.optional();

export const IMAGE_FILE = z.instanceof(File).refine(
  (file) => ['image/png', 'image/jpeg', 'image/jpg', 'image/tiff', 'image/webp', 'image/gif'].includes(file.type),
  { message: 'Invalid image file type' }, // TODO: translations
);
