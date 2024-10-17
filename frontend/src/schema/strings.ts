import { z } from 'zod';

export const NON_EMPTY_STRING = z.string().min(1);
