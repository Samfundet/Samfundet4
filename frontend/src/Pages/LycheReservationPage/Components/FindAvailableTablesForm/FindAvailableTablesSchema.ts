import { z } from 'zod';
import { GUEST_COUNT, OCCASION, RESERVATION_DATE } from '~/schema/reservation';

export const findTableSchema = z.object({
  occasion: OCCASION,
  guest_count: GUEST_COUNT,
  reservation_date: RESERVATION_DATE,
});

export type FindTableData = z.infer<typeof findTableSchema>;
