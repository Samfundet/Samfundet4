import axios from 'axios';
import { BACKEND_DOMAIN } from '~/constants';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import type { Slug } from '../types';
import type { VenueDto, VenueOpeningHoursUpdate } from './types';

export async function getVenues(): Promise<VenueDto[]> {
  const url = BACKEND_DOMAIN + ROUTES.backend.samfundet__venues_list;
  const response = await axios.get<VenueDto[]>(url, { withCredentials: true });

  return response.data;
}

export async function getVenue(slug: Slug): Promise<VenueDto> {
  const url = BACKEND_DOMAIN + reverse({ pattern: ROUTES.backend.samfundet__venues_detail, urlParams: { slug } });
  const response = await axios.get<VenueDto>(url, { withCredentials: true });

  return response.data;
}

export async function patchVenue(slug: Slug, changes: Partial<VenueDto>): Promise<VenueDto> {
  const url = BACKEND_DOMAIN + reverse({ pattern: ROUTES.backend.samfundet__venues_detail, urlParams: { slug } });
  const response = await axios.patch<VenueDto>(url, changes, { withCredentials: true });

  return response.data;
}

export async function updateVenueOpeningHours(updates: VenueOpeningHoursUpdate[]) {
  const results = await Promise.allSettled(updates.map(({ slug, changes }) => patchVenue(slug, changes)));
  const failedSlugs: Slug[] = [];

  for (const [index, result] of results.entries()) {
    if (result.status === 'rejected') {
      failedSlugs.push(updates[index].slug);
      console.error(`Error updating venue ${updates[index].slug}:`, result.reason);
    }
  }

  return { failedSlugs };
}

export async function getOpenVenues(): Promise<VenueDto[]> {
  const url = BACKEND_DOMAIN + ROUTES.backend.samfundet__venues_open_venues;
  const response = await axios.get<VenueDto[]>(url, { withCredentials: true });

  return response.data;
}
