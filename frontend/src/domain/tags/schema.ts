import { z } from 'zod';

export const TAG = z.object({ name: z.string(), color: z.string(), id: z.number() });

export const OPTIONAL_TAG = TAG.optional();
