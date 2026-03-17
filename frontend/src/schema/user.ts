import type { TFunction } from 'i18next';
import { z } from 'zod';
import {
  MEMBERSHIP_ID_LENGTH_MAX,
  MEMBERSHIP_ID_LENGTH_MIN,
  PASSWORD_LENGTH_MAX,
  PASSWORD_LENGTH_MIN,
  USERNAME_LENGTH_MAX,
  USERNAME_LENGTH_MIN,
} from '~/constants';
import { KEY } from '~/i18n/constants';
import { lowerCapitalize } from '~/utils';

export const USERNAME = z.string().min(USERNAME_LENGTH_MIN).max(USERNAME_LENGTH_MAX);

export const PASSWORD = z.string().min(PASSWORD_LENGTH_MIN).max(PASSWORD_LENGTH_MAX);

export const EMAIL = z.string().email();

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
