import { z } from 'zod';

export const NON_EMPTY_STRING = z.string().min(1);
export const OPTIONAL_NON_EMPTY_STRING = z.string().min(1).optional().or(z.literal(''));
