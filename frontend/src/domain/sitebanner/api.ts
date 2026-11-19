import axios from 'axios';
import { BACKEND_DOMAIN } from '~/constants';
import { ROUTES } from '~/routes';
import type { SiteBannerDto, SiteBannerWriteDto } from './types';

export async function getActiveSiteBanner(): Promise<SiteBannerDto | null> {
  const url = BACKEND_DOMAIN + ROUTES.backend.samfundet__site_banners_active;
  const response = await axios.get<SiteBannerDto | null>(url, { withCredentials: true });
  return response.data;
}

export async function postSiteBanner(data: SiteBannerWriteDto): Promise<SiteBannerDto> {
  const url = BACKEND_DOMAIN + ROUTES.backend.samfundet__site_banners_list;
  const response = await axios.post<SiteBannerDto>(url, data, { withCredentials: true });
  return response.data;
}
