import type { InfoboxDto } from '~/dto';
import type { EventDto } from '../events/types';

export type HomePageElementBaseDto = {
  title_nb: string;
  title_en: string;
  description_nb?: string;
  description_en?: string;
};

export type CarouselElementDto = HomePageElementBaseDto & {
  variation: 'carousel';
  events: EventDto[];
};

export type LargeCardElementDto = HomePageElementBaseDto & {
  variation: 'large-card';
  events: EventDto[];
};

export type InfoboxRowElementDto = HomePageElementBaseDto & {
  variation: 'infobox';
  infoboxes: InfoboxDto[];
};

export type HomePageElementDto = CarouselElementDto | LargeCardElementDto | InfoboxRowElementDto;

export type HomePageElementVariation = HomePageElementDto['variation'];

export type HomePageDto = {
  splash: EventDto[];
  elements: HomePageElementDto[];
};
