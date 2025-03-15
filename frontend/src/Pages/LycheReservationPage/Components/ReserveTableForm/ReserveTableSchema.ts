// Combined schema for all form data

import { z } from 'zod';
import {
  ADDITIONAL_INFO,
  AGREE,
  EMAIL,
  GUEST_COUNT,
  NAME,
  OCCASION,
  PHONENUMBER,
  RESERVATION_DATE,
  START_TIME,
} from '~/schema/reservation';

export const reservationSchema = z.object({
  occasion: OCCASION,
  guest_count: GUEST_COUNT,
  reservation_date: RESERVATION_DATE,
  start_time: START_TIME,
  name: NAME,
  phonenumber: PHONENUMBER,
  email: EMAIL,
  additional_info: ADDITIONAL_INFO,
  agree: AGREE,
});
export type ReservationFormData = z.infer<typeof reservationSchema>;
