import axios from 'axios';
import { t } from 'i18next';
import type { ReservationFormData } from '~/Pages/LycheReservationPage/Components/ReserveTableForm/ReserveTableSchema';
import { BACKEND_DOMAIN } from '~/constants';
import { KEY } from '~/i18n/constants';
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
        throw new Error(t(KEY.error_invalid_reservation_data));
      }
    }

    // Re-throw other errors
    throw error;
  }
}

export interface ReservationPostData extends Omit<ReservationFormData, 'reservation_date'> {
  reservation_date: string;
}

export async function reserveTable(data: ReservationPostData): Promise<void> {
  const url = BACKEND_DOMAIN + ROUTES.backend.samfundet__reservation_create;
  console.table(data);
  try {
    await axios.post(url, data, { withCredentials: true });
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      // Handle the 406 error specifically
      if (error.response.status === 406) {
        const errorData = error.response.data as ReservationCheckError;
        throw new Error(errorData.error_en);
      }

      // Handle validation errors
      if (error.response.status === 400) {
        throw new Error(t(KEY.error_invalid_reservation_data));
      }
    }

    // Re-throw other errors
    throw error;
  }
}
