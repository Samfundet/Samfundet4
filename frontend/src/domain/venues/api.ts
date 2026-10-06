import axios from 'axios';
import { BACKEND_DOMAIN } from '~/constants';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import type { VenueDto } from './types';

export async function getVenues(): Promise<VenueDto[]> {
  const url = BACKEND_DOMAIN + ROUTES.backend.samfundet__venues_list;
  const response = await axios.get<VenueDto[]>(url, { withCredentials: true });

  return response.data;
}

export async function getVenue(slug: string): Promise<VenueDto> {
  const url = BACKEND_DOMAIN + reverse({ pattern: ROUTES.backend.samfundet__venues_detail, urlParams: { slug } });
  const response = await axios.get<VenueDto>(url, { withCredentials: true });

  return response.data;
}

export async function patchVenue(slug: string, changes: Partial<VenueDto>): Promise<VenueDto> {
  const url = BACKEND_DOMAIN + reverse({ pattern: ROUTES.backend.samfundet__venues_detail, urlParams: { slug } });
  const response = await axios.patch<VenueDto>(url, changes, { withCredentials: true });
  return response.data;
}

export async function getOpenVenues(): Promise<VenueDto[]> {
  const url = BACKEND_DOMAIN + ROUTES.backend.samfundet__venues_open_venues;
  const response = await axios.get<VenueDto[]>(url, { withCredentials: true });
  return response.data;
}
