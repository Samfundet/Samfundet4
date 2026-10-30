import axios from 'axios';
import { BACKEND_DOMAIN } from '~/constants';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import type { ID } from '../types';
import type { EditGangSectionDto, GangSectionDto } from './types';

export async function getAdminGangSections(id: ID): Promise<GangSectionDto[]> {
  const url =
    BACKEND_DOMAIN +
    reverse({
      pattern: ROUTES.backend.samfundet__admin_gangs_gangsections_for_gang,
      urlParams: { pk: id },
    });
  const response = await axios.get<GangSectionDto[]>(url, { withCredentials: true });

  return response.data;
}

export async function getAdminGangSection(id: ID): Promise<GangSectionDto> {
  const url =
    BACKEND_DOMAIN +
    reverse({
      pattern: ROUTES.backend.samfundet__admin_gangsections_detail,
      urlParams: { pk: id },
    });
  const response = await axios.get<GangSectionDto>(url, { withCredentials: true });

  return response.data;
}

export async function postGangSection(data: EditGangSectionDto): Promise<GangSectionDto> {
  const url = BACKEND_DOMAIN + ROUTES.backend.samfundet__admin_gangsections_list;
  const response = await axios.postForm<GangSectionDto>(url, data, { withCredentials: true });

  return response.data;
}

export async function putGangSection(id: ID, data: EditGangSectionDto): Promise<GangSectionDto> {
  const url =
    BACKEND_DOMAIN +
    reverse({
      pattern: ROUTES.backend.samfundet__admin_gangsections_detail,
      urlParams: { pk: id },
    });
  const response = await axios.putForm<GangSectionDto>(url, data, { withCredentials: true });

  return response.data;
}

export async function deleteGangSection(id: ID): Promise<void> {
  const url =
    BACKEND_DOMAIN +
    reverse({
      pattern: ROUTES.backend.samfundet__admin_gangsections_detail,
      urlParams: { pk: id },
    });

  await axios.delete(url, { withCredentials: true });
}
