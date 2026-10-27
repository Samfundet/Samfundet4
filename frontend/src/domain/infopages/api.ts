import axios, { type AxiosResponse } from 'axios';
import { BACKEND_DOMAIN } from '~/constants';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import type {
  EditInformationPageDto,
  InformationPageDto,
  InformationPageOwnerOptionDto,
  InformationPageRevisionDetailDto,
  InformationPageRevisionDto,
} from './types';

export async function getInformationPage(slug_field: string): Promise<InformationPageDto> {
  const url =
    BACKEND_DOMAIN +
    reverse({ pattern: ROUTES.backend.samfundet__information_pages_detail, urlParams: { slugField: slug_field } });
  const response = await axios.get<InformationPageDto>(url, { withCredentials: true });
  return response.data;
}

export async function getAdminInformationPages(): Promise<InformationPageDto[]> {
  const url = BACKEND_DOMAIN + ROUTES.backend.samfundet__admin_information_pages_list;
  const response = await axios.get<InformationPageDto[]>(url, { withCredentials: true });

  return response.data;
}

export async function getAdminInformationPage(slug_field: string): Promise<InformationPageDto> {
  const url =
    BACKEND_DOMAIN +
    reverse({
      pattern: ROUTES.backend.samfundet__admin_information_pages_detail,
      urlParams: { slugField: slug_field },
    });
  const response = await axios.get<InformationPageDto>(url, { withCredentials: true });

  return response.data;
}

export async function getAdminInformationPageHistory(slug_field: string): Promise<InformationPageRevisionDto[]> {
  const url =
    BACKEND_DOMAIN +
    reverse({
      pattern: ROUTES.backend.samfundet__admin_information_pages_history,
      urlParams: { slugField: slug_field },
    });
  const response = await axios.get<InformationPageRevisionDto[]>(url, { withCredentials: true });

  return response.data;
}

export async function getAdminInformationPageRevision(
  slug_field: string,
  version: number,
): Promise<InformationPageRevisionDetailDto> {
  const url =
    BACKEND_DOMAIN +
    reverse({
      pattern: ROUTES.backend.samfundet__admin_information_pages_history_detail,
      urlParams: { slugField: slug_field, version: version },
    });
  const response = await axios.get<InformationPageRevisionDetailDto>(url, { withCredentials: true });

  return response.data;
}

export async function getInformationPageOwnerOptions(): Promise<InformationPageOwnerOptionDto[]> {
  const url = BACKEND_DOMAIN + ROUTES.backend.samfundet__admin_information_pages_owner_options;
  const response = await axios.get<InformationPageOwnerOptionDto[]>(url, { withCredentials: true });

  return response.data;
}

export async function postInformationPage(data: EditInformationPageDto): Promise<InformationPageDto> {
  const url = BACKEND_DOMAIN + ROUTES.backend.samfundet__admin_information_pages_list;
  const response = await axios.post<InformationPageDto>(url, data, { withCredentials: true });
  return response.data;
}

export async function putInformationPage(slug: string, page: EditInformationPageDto): Promise<AxiosResponse> {
  const url =
    BACKEND_DOMAIN +
    reverse({
      pattern: ROUTES.backend.samfundet__admin_information_pages_detail,
      urlParams: { slugField: slug },
    });
  return await axios.put<InformationPageDto>(url, page, { withCredentials: true });
}

export async function deleteInformationPage(slug_field: string): Promise<AxiosResponse> {
  const url =
    BACKEND_DOMAIN +
    reverse({
      pattern: ROUTES.backend.samfundet__admin_information_pages_detail,
      urlParams: { slugField: slug_field },
    });
  const response = await axios.delete<AxiosResponse>(url, { withCredentials: true });

  return response.data;
}
