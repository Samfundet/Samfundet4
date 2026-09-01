import axios from 'axios';
import { BACKEND_DOMAIN } from '~/constants';
import type { ClosedPeriodDto } from '~/dto';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';

export async function getClosedPeriods(): Promise<ClosedPeriodDto[]> {
  const url = BACKEND_DOMAIN + ROUTES.backend.samfundet__closedperiods_list;
  const response = await axios.get<ClosedPeriodDto[]>(url, { withCredentials: true });
  return response.data;
}

/**
 * Returns a list of all currently active/closed closedPeriods, Samfundet is open if the array is empty
 */
export async function getActiveClosedPeriods(): Promise<ClosedPeriodDto[]> {
  const url = BACKEND_DOMAIN + ROUTES.backend.samfundet__isclosed;
  const response = await axios.get<ClosedPeriodDto[]>(url, { withCredentials: true });
  return response.data;
}

export async function getClosedPeriod(id: string | number): Promise<ClosedPeriodDto> {
  const url =
    BACKEND_DOMAIN + reverse({ pattern: ROUTES.backend.samfundet__closedperiods_detail, urlParams: { pk: id } });
  const response = await axios.get<ClosedPeriodDto>(url, { withCredentials: true });
  return response.data;
}

export async function putClosedPeriod(id: string | number, data: Partial<ClosedPeriodDto>): Promise<ClosedPeriodDto> {
  const url =
    BACKEND_DOMAIN + reverse({ pattern: ROUTES.backend.samfundet__closedperiods_detail, urlParams: { pk: id } });
  const response = await axios.put<ClosedPeriodDto>(url, data, { withCredentials: true });
  return response.data;
}

export async function postClosedPeriod(data: Partial<ClosedPeriodDto>): Promise<ClosedPeriodDto> {
  const url = BACKEND_DOMAIN + ROUTES.backend.samfundet__closedperiods_list;
  const response = await axios.post<ClosedPeriodDto>(url, data, { withCredentials: true });
  return response.data;
}

export async function deleteClosedPeriod(id: string | number): Promise<void> {
  const url =
    BACKEND_DOMAIN + reverse({ pattern: ROUTES.backend.samfundet__closedperiods_detail, urlParams: { pk: id } });
  await axios.delete(url, { withCredentials: true });
}
