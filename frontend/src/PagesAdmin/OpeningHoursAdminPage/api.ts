import axios from 'axios';
import { BACKEND_DOMAIN } from '~/constants';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import type { Day } from '~/types';
import type { VenueDaySchedule, VenueDayScheduleDto } from './dto';

export async function patchVenueDaySchedule(
  slug: string,
  weekday: Day,
  schedule: VenueDaySchedule,
): Promise<VenueDayScheduleDto> {
  const url =
    BACKEND_DOMAIN + reverse({ pattern: ROUTES.backend.samfundet__venues_opening_hours, urlParams: { slug, weekday } });
  const response = await axios.patch<VenueDayScheduleDto>(url, schedule, { withCredentials: true });
  return response.data;
}
