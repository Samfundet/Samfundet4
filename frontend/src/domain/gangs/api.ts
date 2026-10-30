import axios from 'axios';
import { BACKEND_DOMAIN } from '~/constants';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import type { ID } from '../types';
import type { AdminGangListOrganizationDto, AdminGangTypeDto, EditGangDto, GangDto, GangTypeDto } from './types';

export async function getOrganizedGangList(): Promise<GangTypeDto[]> {
  const url = BACKEND_DOMAIN + ROUTES.backend.samfundet__gangs_organized_list;
  const response = await axios.get<GangTypeDto[]>(url, { withCredentials: true });

  return response.data;
}

export async function getAdminGangs(): Promise<AdminGangListOrganizationDto[]> {
  const url = BACKEND_DOMAIN + ROUTES.backend.samfundet__admin_gangs_list;
  const response = await axios.get<AdminGangListOrganizationDto[]>(url, { withCredentials: true });

  return response.data;
}

export async function getAdminGang(id: ID): Promise<GangDto> {
  const url =
    BACKEND_DOMAIN +
    reverse({
      pattern: ROUTES.backend.samfundet__admin_gangs_detail,
      urlParams: { pk: id },
    });
  const response = await axios.get<GangDto>(url, { withCredentials: true });

  return response.data;
}

export async function getAdminGangTypes(organizationId: ID): Promise<AdminGangTypeDto[]> {
  const url =
    BACKEND_DOMAIN +
    reverse({
      pattern: ROUTES.backend.samfundet__admin_gangs_types_for_organization,
      urlParams: { organization: organizationId },
    });
  const response = await axios.get<AdminGangTypeDto[]>(url, { withCredentials: true });

  return response.data;
}

export async function getGangsByOrganization(id: ID): Promise<GangDto[]> {
  const url =
    BACKEND_DOMAIN +
    reverse({
      pattern: ROUTES.backend.samfundet__organizations_gangs,
      urlParams: { pk: id },
    });
  const response = await axios.get<GangDto[]>(url, { withCredentials: true });

  return response.data;
}

export async function postGang(data: EditGangDto): Promise<GangDto> {
  const url = BACKEND_DOMAIN + ROUTES.backend.samfundet__admin_gangs_list;
  const response = await axios.postForm<GangDto>(url, data, { withCredentials: true });

  return response.data;
}

export async function putGang(id: ID, data: EditGangDto): Promise<GangDto> {
  const url =
    BACKEND_DOMAIN +
    reverse({
      pattern: ROUTES.backend.samfundet__admin_gangs_detail,
      urlParams: { pk: id },
    });
  const response = await axios.putForm<GangDto>(url, data, { withCredentials: true });

  return response.data;
}

export async function deleteGang(id: ID): Promise<void> {
  const url =
    BACKEND_DOMAIN +
    reverse({
      pattern: ROUTES.backend.samfundet__admin_gangs_detail,
      urlParams: { pk: id },
    });

  await axios.delete(url, { withCredentials: true });
}
