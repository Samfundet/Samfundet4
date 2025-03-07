import axios from 'axios';
import { BACKEND_DOMAIN } from '~/constants';
import { ROUTES } from '~/routes';
import type { AvailableTimes, ReservationCheckAvailabilityDto } from './sultenDtos';

export type ReservationCheckError = {
  error_nb: string;
  error_en: string;
};

export async function checkReservationAvailability(
  data: ReservationCheckAvailabilityDto,
  venue?: string,
): Promise<AvailableTimes[]> {
  const url = BACKEND_DOMAIN + ROUTES.backend.samfundet__check_reservation;

  // Add venue as a query parameter if provided
  const config = {
    withCredentials: true,
    params: venue ? { venue } : {},
  };

  try {
    const response = await axios.post(url, data, config);
    return response.data as AvailableTimes[];
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      // Handle the 406 error specifically
      if (error.response.status === 406) {
        const errorData = error.response.data as ReservationCheckError;
        throw new Error(errorData.error_en);
      }

      // Handle validation errors
      if (error.response.status === 400) {
        throw new Error('Invalid reservation data');
      }
    }

    // Re-throw other errors
    throw error;
  }
}
