import type { VenueDto } from '~/dto';
import type { Day } from '~/types';

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
