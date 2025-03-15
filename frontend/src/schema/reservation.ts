import { z } from 'zod';
import { PHONENUMBER_REGEX } from '~/constants';
import { allReservationOccationValues } from '~/types/sultenTypes';

export const OCCASION = z.enum([...allReservationOccationValues] as [string, ...string[]]);
export const GUEST_COUNT = z.number().int().min(1).max(8);
export const RESERVATION_DATE = z.date();
export const START_TIME = z.string().min(1);
export const NAME = z.string().min(1);
export const PHONENUMBER = z.string().regex(PHONENUMBER_REGEX, 'Invalid phonenumber');
export const EMAIL = z.string().email('Invalid email address');
export const ADDITIONAL_INFO = z.string().optional();
export const AGREE = z.boolean().refine((val: boolean) => val === true, 'You must agree to the terms');
