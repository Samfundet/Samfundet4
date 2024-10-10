import { z } from 'zod';

export const INFO_PAGE_SLUG = z.string().max(64);
