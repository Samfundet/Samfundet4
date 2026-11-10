export type InfoboxId = string | number;

export type InfoboxDto = {
  id: number;
  title_nb?: string;
  text_nb?: string;
  title_en: string;
  text_en: string;
  color: string;
  url?: string | null;
  image?: number | null;
};
