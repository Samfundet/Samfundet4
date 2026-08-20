import { z } from 'zod';

export const MESSAGE = z.string().min(10).max(200);
export const DATE = z.string().date();
