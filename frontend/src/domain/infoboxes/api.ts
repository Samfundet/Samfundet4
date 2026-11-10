import axios, { type AxiosResponse } from 'axios';
import { BACKEND_DOMAIN } from '~/constants';
import { ROUTES } from '~/routes';
import type { InfoboxDto } from './types';

function getInfoboxDetailUrl(id: string | number): string {
  return ROUTES.backend.samfundet__infobox_detail.replace(':pk', encodeURIComponent(String(id)));
}

export async function getInfoboxes(): Promise<InfoboxDto[]> {
  const url = BACKEND_DOMAIN + ROUTES.backend.samfundet__infobox_list;
  const response = await axios.get<InfoboxDto[]>(url, { withCredentials: true });
  return response.data;
}

export async function getInfobox(id: string | number): Promise<InfoboxDto> {
  const url = BACKEND_DOMAIN + getInfoboxDetailUrl(id);
  const response = await axios.get<InfoboxDto>(url, { withCredentials: true });
  return response.data;
}

export async function postInfobox(data: Partial<InfoboxDto>): Promise<InfoboxDto> {
  const url = BACKEND_DOMAIN + ROUTES.backend.samfundet__infobox_list;
  const response = await axios.post<InfoboxDto>(url, data, { withCredentials: true });
  return response.data;
}

export async function putInfobox(id: string | number, data: Partial<InfoboxDto>): Promise<AxiosResponse> {
  const url = BACKEND_DOMAIN + getInfoboxDetailUrl(id);
  const response = await axios.put<InfoboxDto>(url, data, { withCredentials: true });
  return response;
}

export async function deleteInfobox(id: string | number): Promise<AxiosResponse> {
  const url = BACKEND_DOMAIN + getInfoboxDetailUrl(id);
  const response = await axios.delete<AxiosResponse>(url, { withCredentials: true });
  return response;
}
