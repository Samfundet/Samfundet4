import format from 'date-fns/format/index';
import { t } from 'i18next';
import { z } from 'zod';
import { KEY } from '~/i18n/constants';

export const MESSAGE = z.string().min(10).max(200);
export const DATE = z.string().date();

export const closedPeriodSchema = z
  .object({
    message_nb: MESSAGE,
    message_en: MESSAGE,
    start_dt: DATE,
    end_dt: DATE,
  })
  .refine((data) => data.end_dt > data.start_dt, {
    message: t(KEY.admin_closed_period_end_before_start),
    path: ['end_dt'],
  })
  .refine((data) => data.end_dt >= format(new Date(), 'yyyy-MM-dd'), {
    message: t(KEY.admin_closed_period_end_before_today),
    path: ['end_dt'],
  });

export type ClosedPeriodFormType = z.infer<typeof closedPeriodSchema>;
