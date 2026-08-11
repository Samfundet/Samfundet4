import { z } from 'zod';
import { LOCAL_DATETIME } from '~/schema/dates';

export const TITLE_NB = z.string();

export const TITLE_EN = z.string();

export const CATEGORY = z.string();

export const PUBLICATION_DATE = LOCAL_DATETIME.optional().or(z.literal(''));

export const FILE = z.instanceof(File).refine(
  (file) => file.type === 'application/pdf',
  { message: 'File must be a PDF' }, // TODO: translations
);
