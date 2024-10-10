import { z } from 'zod';

export const recruitmentPositionSchema = z.object({
  name_nb: z.string().min(1),
  name_en: z.string().min(1),
  norwegian_applicants_only: z.boolean(),
  short_description_nb: z.string().min(1),
  short_description_en: z.string().min(1),
  long_description_nb: z.string().min(1),
  long_description_en: z.string().min(1),
  is_funksjonaer_position: z.boolean(),
  default_application_letter_nb: z.string().min(1),
  default_application_letter_en: z.string().min(1),
  tags: z.string().min(1),
});
