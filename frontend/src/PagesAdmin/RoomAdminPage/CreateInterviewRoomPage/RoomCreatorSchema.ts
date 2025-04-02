import { z } from 'zod';
import { LOCAL_DATETIME } from '~/schema/dates';

export const roomSchema = z.object({
  name: z.string().min(1, { message: 'Navn er påkrevd' }),
  location: z.string().min(1, { message: 'Lokasjon er påkrevd' }),
  start_time: LOCAL_DATETIME,
  end_time: LOCAL_DATETIME,
});
