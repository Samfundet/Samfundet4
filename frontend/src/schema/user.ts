import type { TFunction } from 'i18next';
import { z } from 'zod';
import {
  MAX_AGE,
  MEMBERSHIP_ID_LENGTH_MAX,
  MEMBERSHIP_ID_LENGTH_MIN,
  MIN_AGE,
  PASSWORD_LENGTH_MAX,
  PASSWORD_LENGTH_MIN,
  PHONENUMBER_REGEX,
  USERNAME_LENGTH_MAX,
  USERNAME_LENGTH_MIN,
} from '~/constants';
import { KEY } from '~/i18n/constants';
import { lowerCapitalize } from '~/utils';

export const USERNAME = z.string().min(USERNAME_LENGTH_MIN).max(USERNAME_LENGTH_MAX);

export const PASSWORD = z.string().min(PASSWORD_LENGTH_MIN).max(PASSWORD_LENGTH_MAX);

export const EMAIL = z.string().email();

export const PHONE_NUMBER = (t: TFunction) => z.string().regex(PHONENUMBER_REGEX, t(KEY.invalid_phonenumber));

export const FIRST_NAME = z.string();

export const LAST_NAME = z.string();

// Date of birth as an ISO date string (YYYY-MM-DD)
export const DATE_OF_BIRTH = (t: TFunction) =>
  z.string().refine((value) => {
    if (value === '' || Number.isNaN(Date.parse(value))) {
      return false;
    }
    const dob = new Date(value);
    const today = new Date();
    if (dob > today) {
      return false;
    }
    let age = today.getFullYear() - dob.getFullYear();

    // check if we're past the birthday in the current year
    const pastBirthday =
      today.getMonth() > dob.getMonth() || (today.getMonth() === dob.getMonth() && today.getDate() >= dob.getDate());
    if (!pastBirthday) {
      age -= 1;
    }
    return age >= MIN_AGE && age <= MAX_AGE;
  }, t(KEY.invalid_date_of_birth));

export const MEMBERSHIPNUMBER = z.string().min(MEMBERSHIP_ID_LENGTH_MIN).max(MEMBERSHIP_ID_LENGTH_MAX).regex(/^\d+$/);

export const EMAIL_OR_MEMBERSHIP_NUMBER = (t: TFunction) =>
  z.string().superRefine((value, ctx) => {
    const membershipNumberResult = MEMBERSHIPNUMBER.safeParse(value).success;
    const emailResult = EMAIL.safeParse(value).success;

    if (!emailResult && !membershipNumberResult) {
      const onlyNumbers = /^\d+$/.test(value);
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: onlyNumbers
          ? lowerCapitalize(t(KEY.adminpage_connect_mdb_invalid_membership_id))
          : lowerCapitalize(t(KEY.adminpage_connect_mdb_invalid_email)),
      });
    }
  });
