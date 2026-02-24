import { z } from 'zod';

export const TAG = z.object({ name: z.string(), color: z.string(), id: z.number() });

export const OPTIONAL_TAG = TAG.optional();

export const IMAGE = z.object({
  url: z.string(),
  id: z.number(),
  title: z.string(),
  tags: z.any().optional(),
}).passthrough();

export const OPTIONAL_IMAGE = IMAGE.optional();
