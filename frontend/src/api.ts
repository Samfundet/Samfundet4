import axios, { AxiosResponse } from 'axios';
import {
  FoodCategoryDto,
  FoodPreferenceDto,
  InformationPageDto,
  MenuDto,
  MenuItemDto,
  PermissionDto,
  SaksdokumentDto,
  UserDto,
  UserPreferenceDto,
  VenueDto,
  GangTypeDto,
} from '~/dto';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';

const TEMP_DOMAIN = 'http://localhost:8000';

export async function getCsrfToken(): Promise<string> {
  const url = TEMP_DOMAIN + ROUTES.backend.samfundet__csrf;
  const response = await axios.get(url, { withCredentials: true });
  return response.data;
}

export async function login(username: string, password: string): Promise<number> {
  const url = TEMP_DOMAIN + ROUTES.backend.samfundet__login;
  const data = { username, password };
  const response = await axios.post(url, data, { withCredentials: true });

  // Django rotates csrftoken after login, set new token received.
  const new_token = response.data;
  axios.defaults.headers.common['X-CSRFToken'] = new_token;

  return response.status;
}

export async function logout(): Promise<AxiosResponse> {
  const url = TEMP_DOMAIN + ROUTES.backend.samfundet__logout;
  const response = await axios.post(url, undefined, { withCredentials: true });

  return response;
}

export async function getAllPermissions(): Promise<PermissionDto[]> {
  const url = TEMP_DOMAIN + ROUTES.backend.samfundet__permissions;
  const response = await axios.get<PermissionDto[]>(url, { withCredentials: true });

  return response.data;
}

export async function getUser(): Promise<UserDto> {
  const url = TEMP_DOMAIN + ROUTES.backend.samfundet__user;
  const response = await axios.get<UserDto>(url, { withCredentials: true });

  return response.data;
}

export async function putUserPreference(data: UserPreferenceDto): Promise<unknown> {
  const url =
    TEMP_DOMAIN +
    reverse({
      pattern: ROUTES.backend.samfundet__user_preference_detail,
      urlParams: { pk: data.id },
    });
  const response = await axios.put<UserPreferenceDto>(url, data, { withCredentials: true });

  return response.data;
}

export async function getVenues(): Promise<VenueDto[]> {
  const url = TEMP_DOMAIN + reverse({ pattern: ROUTES.backend.samfundet__venues_list });
  const response = await axios.get<VenueDto[]>(url, { withCredentials: true });

  return response.data;
}

export async function getVenue(id: number): Promise<VenueDto> {
  const url = TEMP_DOMAIN + reverse({ pattern: ROUTES.backend.samfundet__venues_detail, urlParams: { pk: id } });
  const response = await axios.get<VenueDto>(url, { withCredentials: true });

  return response.data;
}

export async function getInformationPages(): Promise<InformationPageDto[]> {
  const url = TEMP_DOMAIN + reverse({ pattern: ROUTES.backend.samfundet__information_list });
  const response = await axios.get<InformationPageDto[]>(url, { withCredentials: true });

  return response.data;
}

export async function getInformationPage(slug_field: string): Promise<InformationPageDto> {
  const url =
    TEMP_DOMAIN + reverse({ pattern: ROUTES.backend.samfundet__information_detail, urlParams: { pk: slug_field } });
  const response = await axios.get<InformationPageDto>(url, { withCredentials: true });

  return response.data;
}
export async function postInformationPage(data: InformationPageDto): Promise<InformationPageDto> {
  const url = TEMP_DOMAIN + reverse({ pattern: ROUTES.backend.samfundet__information_list });
  const response = await axios.post<InformationPageDto>(url, data, { withCredentials: true });
  return response.data;
}

export async function putInformationPage(page: InformationPageDto): Promise<AxiosResponse> {
  const url =
    TEMP_DOMAIN +
    reverse({ pattern: ROUTES.backend.samfundet__information_detail, urlParams: { pk: page.slug_field } });
  const response = await axios.put<InformationPageDto>(url, page, { withCredentials: true });

  return response;
}

export async function getMenus(): Promise<MenuDto[]> {
  const url = TEMP_DOMAIN + reverse({ pattern: ROUTES.backend.samfundet__menu_list });
  const response = await axios.get<MenuDto[]>(url, { withCredentials: true });

  return response.data;
}

export async function getMenu(pk: number): Promise<MenuDto> {
  const url = TEMP_DOMAIN + reverse({ pattern: ROUTES.backend.samfundet__menu_detail, urlParams: { pk: pk } });
  const response = await axios.get<MenuDto>(url, { withCredentials: true });

  return response.data;
}

export async function getMenuItems(): Promise<MenuItemDto[]> {
  const url = TEMP_DOMAIN + reverse({ pattern: ROUTES.backend.samfundet__information_list });
  const response = await axios.get<MenuItemDto[]>(url, { withCredentials: true });

  return response.data;
}

export async function getMenuItem(pk: number): Promise<MenuItemDto> {
  const url = TEMP_DOMAIN + reverse({ pattern: ROUTES.backend.samfundet__information_detail, urlParams: { pk: pk } });
  const response = await axios.get<MenuItemDto>(url, { withCredentials: true });

  return response.data;
}

export async function getFoodPreferences(): Promise<FoodPreferenceDto[]> {
  const url = TEMP_DOMAIN + reverse({ pattern: ROUTES.backend.samfundet__information_list });
  const response = await axios.get<FoodPreferenceDto[]>(url, { withCredentials: true });

  return response.data;
}

export async function getFoodPreference(pk: number): Promise<FoodPreferenceDto> {
  const url = TEMP_DOMAIN + reverse({ pattern: ROUTES.backend.samfundet__information_detail, urlParams: { pk: pk } });
  const response = await axios.get<FoodPreferenceDto>(url, { withCredentials: true });

  return response.data;
}

export async function getFoodCategorys(): Promise<FoodCategoryDto[]> {
  const url = TEMP_DOMAIN + reverse({ pattern: ROUTES.backend.samfundet__information_list });
  const response = await axios.get<FoodCategoryDto[]>(url, { withCredentials: true });

  return response.data;
}

export async function getFoodCategory(pk: number): Promise<FoodCategoryDto> {
  const url = TEMP_DOMAIN + reverse({ pattern: ROUTES.backend.samfundet__information_detail, urlParams: { pk: pk } });
  const response = await axios.get<FoodCategoryDto>(url, { withCredentials: true });

  return response.data;
}

export async function getSaksdokumenter(): Promise<SaksdokumentDto> {
  const url = TEMP_DOMAIN + reverse({ pattern: ROUTES.backend.samfundet__saksdokument_list });
  const response = await axios.get<SaksdokumentDto>(url, { withCredentials: true });

  return response.data;
}

export async function getGangList(): Promise<GangTypeDto[]> {
  const url = TEMP_DOMAIN + reverse({ pattern: ROUTES.backend.samfundet__gangs_organized });
  const response = await axios.get<GangTypeDto[]>(url, { withCredentials: true });

  return response.data;
}
