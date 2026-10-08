import { z } from 'zod';
import { isValidBannerUrl } from '~/Components/SiteBanner/utils';
import { KEY } from '~/i18n/constants';

export const MAX_TEXT_LENGTH = 128;
export const MAX_URL_LENGTH = 500;

function isValidDate(value: string): boolean {
  return Number.isFinite(new Date(value).getTime());
}

const textField = z.string().trim().min(1, KEY.common_required).max(MAX_TEXT_LENGTH, KEY.admin_site_banner_text_hint);

const dateField = z
  .string()
  .min(1, KEY.common_required)
  .refine((value) => !value || isValidDate(value), KEY.admin_site_banner_validation_date);

export const siteBannerSchema = z
  .object({
    text_nb: textField,
    text_en: textField,
    url: z
      .string()
      .trim()
      .max(MAX_URL_LENGTH)
      .refine(isValidBannerUrl, KEY.admin_site_banner_validation_url)
      .optional()
      .default(''),
    new_tab: z.boolean().default(false),
    start_at: dateField,
    end_at: dateField,
  })
  .superRefine((values, context) => {
    if (!isValidDate(values.start_at) || !isValidDate(values.end_at)) return;

    if (new Date(values.end_at) <= new Date(values.start_at)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: KEY.admin_site_banner_validation_end,
        path: ['end_at'],
      });
    }
  });

export type SiteBannerFormValues = z.infer<typeof siteBannerSchema>;
