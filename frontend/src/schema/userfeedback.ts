import { z } from 'zod';

export const TEXT = z.string();

export const CONTACT_EMAIL = z.string().email().optional().or(z.literal(''));
