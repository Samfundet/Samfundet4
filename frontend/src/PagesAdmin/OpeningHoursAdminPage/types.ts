import type { Day } from '~/types';

export type VenueDaySchedule = {
  is_open: boolean;
  opening: string;
  closing: string;
};

export type VenueDayScheduleDto = VenueDaySchedule & { weekday: Day };
