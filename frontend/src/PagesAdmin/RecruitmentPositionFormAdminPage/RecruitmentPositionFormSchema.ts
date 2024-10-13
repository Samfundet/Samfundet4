import { z } from 'zod';
import { NON_EMPTY_STRING } from '~/schema/strings';

export const recruitmentPositionSchema = z.object({
  name_nb: NON_EMPTY_STRING,
  name_en: NON_EMPTY_STRING,
  norwegian_applicants_only: z.boolean(),
  short_description_nb: NON_EMPTY_STRING,
  short_description_en: NON_EMPTY_STRING,
  long_description_nb: NON_EMPTY_STRING,
  long_description_en: NON_EMPTY_STRING,
  is_funksjonaer_position: z.boolean(),
  default_application_letter_nb: NON_EMPTY_STRING,
  default_application_letter_en: NON_EMPTY_STRING,
  tags: NON_EMPTY_STRING,
});
