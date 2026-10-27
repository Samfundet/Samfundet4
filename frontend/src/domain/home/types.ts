import type { EventDto } from '../events/types';

export type HomePageElementVariation = 'carousel' | 'large-card';

export type HomePageElementDto = {
  variation: HomePageElementVariation;
  title_nb: string;
  title_en: string;
  description_nb?: string;
  description_no?: string;
  events: EventDto[];
};

export type HomePageDto = {
  splash: EventDto[];
  elements: HomePageElementDto[];
};
