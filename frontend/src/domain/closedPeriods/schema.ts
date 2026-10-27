import { z } from 'zod';

export const CLOSED_PERIOD_MESSAGE = z.string().min(5).max(200);
export const CLOSED_PERIOD_DATE = z.string().date();
