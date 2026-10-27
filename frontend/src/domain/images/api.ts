import axios, { type AxiosResponse } from 'axios';
import { BACKEND_DOMAIN } from '~/constants';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import type { PageNumberPaginationType } from '~/types';
import { buildPaginatedUrl } from '~/utils';
import type { ImageDto, ImagePatchDto, ImagePostDto } from './types';

export async function getImagesPaginated(
  page: number,
  pageSize?: number,
  search?: string,
  tag?: string,
): Promise<PageNumberPaginationType<ImageDto>> {
  const url = buildPaginatedUrl(BACKEND_DOMAIN + ROUTES.backend.samfundet__images_list, page, pageSize, {
    search: search || undefined,
    tag: tag || undefined,
  });
  const response = await axios.get<PageNumberPaginationType<ImageDto>>(url, { withCredentials: true });
  return response.data;
}

export async function getImage(id: string | number): Promise<ImageDto> {
  const url = BACKEND_DOMAIN + reverse({ pattern: ROUTES.backend.samfundet__images_detail, urlParams: { pk: id } });
  const response = await axios.get<ImageDto>(url, { withCredentials: true });
  return response.data;
}

export async function postImage(data: ImagePostDto): Promise<ImageDto> {
  const url = BACKEND_DOMAIN + ROUTES.backend.samfundet__images_list;
  const response = await axios.postForm<ImageDto>(url, data, { withCredentials: true });
  return response.data;
}

export async function patchImage(id: number, data: ImagePatchDto): Promise<ImageDto> {
  const url = BACKEND_DOMAIN + reverse({ pattern: ROUTES.backend.samfundet__images_detail, urlParams: { pk: id } });
  const response = await axios.patchForm<ImageDto>(url, data, { withCredentials: true });
  return response.data;
}

export async function deleteImage(id: number): Promise<AxiosResponse> {
  const url = BACKEND_DOMAIN + reverse({ pattern: ROUTES.backend.samfundet__images_detail, urlParams: { pk: id } });
  const response = await axios.delete<AxiosResponse>(url, { withCredentials: true });
  return response;
}
