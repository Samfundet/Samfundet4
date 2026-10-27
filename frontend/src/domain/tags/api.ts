import axios from 'axios';
import { BACKEND_DOMAIN } from '~/constants';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import type { TagDto } from './types';

export async function getTags(): Promise<TagDto[]> {
  const url = BACKEND_DOMAIN + ROUTES.backend.samfundet__tags_list;
  const response = await axios.get<TagDto[]>(url, { withCredentials: true });
  return response.data;
}

export async function getPopularTags(): Promise<TagDto[]> {
  const url =
    BACKEND_DOMAIN +
    reverse({
      pattern: ROUTES.backend.samfundet__tags_list,
      queryParams: { popular: 'true' },
    });
  const response = await axios.get<TagDto[]>(url, { withCredentials: true });
  return response.data;
}
