import type { BaseModelDto } from '~/dto';

export type CaseDocumentCategoryDto = {
  label: string;
  value: string;
};

export type CaseDocumentDto = BaseModelDto & {
  id: number;
  title_nb: string;
  title_en: string;
  category: string;
  publication_date: string;
  file?: string; // For posting to backend
  url?: string; // Read only backend url
};

export type CaseDocumentPostDto = {
  title_nb: string;
  title_en: string;
  category: string;
  publication_date?: string;
  file: File;
};
