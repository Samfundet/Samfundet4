import { z } from 'zod';
import { KEY } from '~/i18n/constants';
import { LOCAL_DATETIME } from '~/schema/dates';

export const CASE_DOCUMENT_TITLE_NB = z.string();

export const CASE_DOCUMENT_TITLE_EN = z.string();

export const CASE_DOCUMENT_CATEGORY = z.string();

export const CASE_DOCUMENT_PUBLICATION_DATE = LOCAL_DATETIME.optional().or(z.literal(''));

export const CASE_DOCUMENT_FILE = z
  .instanceof(File)
  .refine((file) => file.type === 'application/pdf', { message: KEY.error_file_must_be_pdf });
