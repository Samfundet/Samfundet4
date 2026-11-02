import type { Day } from '~/types';

export type VenueDto = {
  id: number;
  slug: string;
  name: string;
  description?: string;
  floor?: number;
  last_renovated?: number;
  handicapped_approved?: boolean;
  responsible_crew?: string;
  opening?: string;
  closing?: string;
  opening_monday?: string;
  opening_tuesday?: string;
  opening_wednesday?: string;
  opening_thursday?: string;
  opening_friday?: string;
  opening_saturday?: string;
  opening_sunday?: string;

  is_open_monday: boolean;
  is_open_tuesday: boolean;
  is_open_wednesday: boolean;
  is_open_thursday: boolean;
  is_open_friday: boolean;
  is_open_saturday: boolean;
  is_open_sunday: boolean;

  closing_monday?: string;
  closing_tuesday?: string;
  closing_wednesday?: string;
  closing_thursday?: string;
  closing_friday?: string;
  closing_saturday?: string;
  closing_sunday?: string;
};

export type OpenVenuesDto = VenueDto[];

export type VenueDaySchedule = {
  is_open: boolean;
  opening: string;
  closing: string;
};

export type VenueOpeningHoursField = `is_open_${Day}` | `opening_${Day}` | `closing_${Day}`;

export type VenueOpeningHoursPatch = Partial<Pick<VenueDto, VenueOpeningHoursField>>;

export type VenueOpeningHoursUpdate = {
  slug: string;
  changes: VenueOpeningHoursPatch;
};
