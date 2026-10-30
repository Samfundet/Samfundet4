import axios from 'axios';
import { BACKEND_DOMAIN } from '~/constants';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import type { Slug } from '../types';
import type {
  EditInformationPageDto,
  InformationPageDto,
  InformationPageOwnerOptionDto,
  InformationPageRevisionDetailDto,
  InformationPageRevisionDto,
} from './types';

export async function getInformationPage(slug: Slug): Promise<InformationPageDto> {
  const url =
    BACKEND_DOMAIN +
    reverse({
      pattern: ROUTES.backend.samfundet__information_pages_detail,
      urlParams: { slugField: slug },
    });
  const response = await axios.get<InformationPageDto>(url, { withCredentials: true });

  return response.data;
}

export async function getAdminInformationPages(): Promise<InformationPageDto[]> {
  const url = BACKEND_DOMAIN + ROUTES.backend.samfundet__admin_information_pages_list;
  const response = await axios.get<InformationPageDto[]>(url, { withCredentials: true });

  return response.data;
}

export async function getAdminInformationPage(slug: Slug): Promise<InformationPageDto> {
  const url =
    BACKEND_DOMAIN +
    reverse({
      pattern: ROUTES.backend.samfundet__admin_information_pages_detail,
      urlParams: { slugField: slug },
    });
  const response = await axios.get<InformationPageDto>(url, { withCredentials: true });

  return response.data;
}

export async function getAdminInformationPageHistory(slug: Slug): Promise<InformationPageRevisionDto[]> {
  const url =
    BACKEND_DOMAIN +
    reverse({
      pattern: ROUTES.backend.samfundet__admin_information_pages_history,
      urlParams: { slugField: slug },
    });
  const response = await axios.get<InformationPageRevisionDto[]>(url, { withCredentials: true });

  return response.data;
}

export async function getAdminInformationPageRevision(
  slug: Slug,
  version: number,
): Promise<InformationPageRevisionDetailDto> {
  const url =
    BACKEND_DOMAIN +
    reverse({
      pattern: ROUTES.backend.samfundet__admin_information_pages_history_detail,
      urlParams: { slugField: slug },
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

export async function putInformationPage(slug: Slug, page: EditInformationPageDto): Promise<InformationPageDto> {
  const url =
    BACKEND_DOMAIN +
    reverse({
      pattern: ROUTES.backend.samfundet__admin_information_pages_detail,
      urlParams: { slugField: slug },
    });
  const response = await axios.put<InformationPageDto>(url, page, { withCredentials: true });

  return response.data;
}

export async function deleteInformationPage(slug: Slug): Promise<void> {
  const url =
    BACKEND_DOMAIN +
    reverse({
      pattern: ROUTES.backend.samfundet__admin_information_pages_detail,
      urlParams: { slugField: slug },
    });

  await axios.delete(url, { withCredentials: true });
}
