import axios, { type AxiosResponse } from 'axios';
import { BACKEND_DOMAIN } from '~/constants';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import type { CaseDocumentCategoryDto, CaseDocumentDto, CaseDocumentPostDto } from './types';

export async function getCaseDocuments(): Promise<CaseDocumentDto[]> {
  const url = BACKEND_DOMAIN + ROUTES.backend.samfundet__saksdokument_list;
  const response = await axios.get<CaseDocumentDto[]>(url, { withCredentials: true });
  return response.data;
}

export async function getCaseDocumentCategories(): Promise<CaseDocumentCategoryDto[]> {
  const url = BACKEND_DOMAIN + ROUTES.backend.samfundet__saksdokument_categories;
  const response = await axios.get<CaseDocumentCategoryDto[]>(url, { withCredentials: true });
  return response.data;
}

export async function getCaseDocument(id: number): Promise<CaseDocumentDto> {
  const url =
    BACKEND_DOMAIN + reverse({ pattern: ROUTES.backend.samfundet__saksdokument_detail, urlParams: { pk: id } });
  const response = await axios.get<CaseDocumentDto>(url, { withCredentials: true });

  return response.data;
}

export async function postCaseDocument(data: CaseDocumentPostDto): Promise<CaseDocumentDto> {
  const url = BACKEND_DOMAIN + ROUTES.backend.samfundet__saksdokument_list;
  const response = await axios.postForm<CaseDocumentDto>(url, data, {
    withCredentials: true,
  });
  return response.data;
}

export async function putCaseDocument(id: string | number, data: Partial<CaseDocumentDto>): Promise<AxiosResponse> {
  const url =
    BACKEND_DOMAIN + reverse({ pattern: ROUTES.backend.samfundet__saksdokument_detail, urlParams: { pk: id } });
  return await axios.put<CaseDocumentDto>(url, data, { withCredentials: true });
}

export async function deleteCaseDocument(id: number): Promise<AxiosResponse> {
  const url =
    BACKEND_DOMAIN +
    reverse({
      pattern: ROUTES.backend.samfundet__saksdokument_detail,
      urlParams: { pk: id },
    });
  return await axios.delete<CaseDocumentDto>(url, { withCredentials: true });
}
