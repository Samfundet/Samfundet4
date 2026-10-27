import axios, { type AxiosResponse } from 'axios';
import { BACKEND_DOMAIN } from '~/constants';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
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

export async function getAdminGang(id: string | number): Promise<GangDto> {
  const url =
    BACKEND_DOMAIN + reverse({ pattern: ROUTES.backend.samfundet__admin_gangs_detail, urlParams: { pk: id } });
  const response = await axios.get<GangDto>(url, { withCredentials: true });

  return response.data;
}

export async function getAdminGangTypes(organizationId: number): Promise<AdminGangTypeDto[]> {
  const url =
    BACKEND_DOMAIN +
    reverse({
      pattern: ROUTES.backend.samfundet__admin_gangs_types_for_organization,
      urlParams: { organization: organizationId },
    });
  const response = await axios.get<AdminGangTypeDto[]>(url, { withCredentials: true });
  return response.data;
}

export async function getGangsByOrganization(id: string | number): Promise<GangDto[]> {
  const url =
    BACKEND_DOMAIN + reverse({ pattern: ROUTES.backend.samfundet__organizations_gangs, urlParams: { pk: id } });
  const response = await axios.get<GangDto[]>(url, { withCredentials: true });
  return response.data;
}

export async function postGang(data: EditGangDto): Promise<GangDto> {
  const url = BACKEND_DOMAIN + ROUTES.backend.samfundet__admin_gangs_list;
  const response = await axios.postForm<GangDto>(url, data, { withCredentials: true });
  return response.data;
}

export async function putGang(id: string | number, data: EditGangDto): Promise<AxiosResponse> {
  const url =
    BACKEND_DOMAIN + reverse({ pattern: ROUTES.backend.samfundet__admin_gangs_detail, urlParams: { pk: id } });
  return await axios.putForm<GangDto>(url, data, { withCredentials: true });
}

export async function deleteGang(id: string | number): Promise<AxiosResponse> {
  const url =
    BACKEND_DOMAIN + reverse({ pattern: ROUTES.backend.samfundet__admin_gangs_detail, urlParams: { pk: id } });
  return await axios.delete(url, { withCredentials: true });
}
