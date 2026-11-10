import { z } from 'zod';
import { NON_EMPTY_STRING } from '~/schema/strings';
import { WEBSITE_URL } from '~/schema/url';
import type { ImageDto } from '../images';

export const INFOBOX_TITLE_NB = NON_EMPTY_STRING;
export const INFOBOX_TEXT_NB = NON_EMPTY_STRING;
export const INFOBOX_TITLE_EN = NON_EMPTY_STRING;
export const INFOBOX_TEXT_EN = NON_EMPTY_STRING;
export const INFOBOX_COLOR = NON_EMPTY_STRING;
export const INFOBOX_URL = WEBSITE_URL.or(z.literal('')).optional();
export const INFOBOX_IMAGE = z.custom<ImageDto>().optional();

export const INFOBOX_FORM_SCHEMA = z.object({
  title_nb: INFOBOX_TITLE_NB,
  text_nb: INFOBOX_TEXT_NB,
  title_en: INFOBOX_TITLE_EN,
  text_en: INFOBOX_TEXT_EN,
  color: INFOBOX_COLOR,
  url: INFOBOX_URL,
  image: INFOBOX_IMAGE,
});

export type InfoboxFormType = z.infer<typeof INFOBOX_FORM_SCHEMA>;
