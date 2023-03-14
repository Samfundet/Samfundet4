import axios, { AxiosResponse } from 'axios';
import {
  ClosedPeriodDto,
  EventDto,
  EventGroupDto,
  FoodCategoryDto,
  FoodPreferenceDto,
  GangDto,
  GangTypeDto,
  ImageDto,
  InformationPageDto,
  MenuDto,
  MenuItemDto,
  SaksdokumentDto,
  TextItemDto,
  UserDto,
  UserPreferenceDto,
  VenueDto,
} from '~/dto';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import { BACKEND_DOMAIN } from './constants';

export async function getCsrfToken(): Promise<string> {
  const url = BACKEND_DOMAIN + ROUTES.backend.samfundet__csrf;
  const response = await axios.get(url, { withCredentials: true });
  return response.data;
}

export async function login(username: string, password: string): Promise<number> {
  const url = BACKEND_DOMAIN + ROUTES.backend.samfundet__login;
  const data = { username, password };
  const response = await axios.post(url, data, { withCredentials: true });

  // Django rotates csrftoken after login, set new token received.
  const new_token = response.data;
  axios.defaults.headers.common['X-CSRFToken'] = new_token;

  return response.status;
}

export async function logout(): Promise<AxiosResponse> {
  const url = BACKEND_DOMAIN + ROUTES.backend.samfundet__logout;
  const response = await axios.post(url, undefined, { withCredentials: true });

  return response;
}

export async function getUser(): Promise<UserDto> {
  const url = BACKEND_DOMAIN + ROUTES.backend.samfundet__user;
  const response = await axios.get<UserDto>(url, { withCredentials: true });

  return response.data;
}

export async function putUserPreference(data: UserPreferenceDto): Promise<unknown> {
  const url =
    BACKEND_DOMAIN +
    reverse({
      pattern: ROUTES.backend.samfundet__user_preference_detail,
      urlParams: { pk: data.id },
    });
  const response = await axios.put<UserPreferenceDto>(url, data, { withCredentials: true });

  return response.data;
}

export async function getVenues(): Promise<VenueDto[]> {
  const url = BACKEND_DOMAIN + reverse({ pattern: ROUTES.backend.samfundet__venues_list });
  const response = await axios.get<VenueDto[]>(url, { withCredentials: true });

  return response.data;
}

export async function getVenue(id: string | number): Promise<VenueDto> {
  const url = BACKEND_DOMAIN + reverse({ pattern: ROUTES.backend.samfundet__venues_detail, urlParams: { pk: id } });
  const response = await axios.get<VenueDto>(url, { withCredentials: true });

  return response.data;
}

export async function getInformationPages(): Promise<InformationPageDto[]> {
  const url = BACKEND_DOMAIN + reverse({ pattern: ROUTES.backend.samfundet__information_list });
  const response = await axios.get<InformationPageDto[]>(url, { withCredentials: true });

  return response.data;
}

export async function getInformationPage(slug_field: string): Promise<InformationPageDto> {
  const url =
    BACKEND_DOMAIN + reverse({ pattern: ROUTES.backend.samfundet__information_detail, urlParams: { pk: slug_field } });
  const response = await axios.get<InformationPageDto>(url, { withCredentials: true });

  return response.data;
}

export async function deleteInformationPage(slug_field: string): Promise<AxiosResponse> {
  const url =
    BACKEND_DOMAIN + reverse({ pattern: ROUTES.backend.samfundet__information_detail, urlParams: { pk: slug_field } });
  const response = await axios.delete<AxiosResponse>(url, { withCredentials: true });

  return response.data;
}

export async function postInformationPage(data: InformationPageDto): Promise<InformationPageDto> {
  const url = BACKEND_DOMAIN + reverse({ pattern: ROUTES.backend.samfundet__information_list });
  const response = await axios.post<InformationPageDto>(url, data, { withCredentials: true });
  return response.data;
}

export async function putInformationPage(slug_field: string, page: InformationPageDto): Promise<AxiosResponse> {
  const url =
    BACKEND_DOMAIN + reverse({ pattern: ROUTES.backend.samfundet__information_detail, urlParams: { pk: slug_field } });
  const response = await axios.put<InformationPageDto>(url, page, { withCredentials: true });
  return response;
}

export async function getEventsPerDay(): Promise<EventDto[]> {
  const url = BACKEND_DOMAIN + reverse({ pattern: ROUTES.backend.samfundet__eventsperday });
  const response = await axios.get<EventDto[]>(url, { withCredentials: true });

  return response.data;
}

export async function getEventsFilter(query: string): Promise<EventDto[]> {
  const url = BACKEND_DOMAIN + reverse({ pattern: ROUTES.backend.samfundet__eventsperday }) + query;
  const response = await axios.get<EventDto[]>(url, { withCredentials: true });

  return response.data;
}

export async function getEventsUpcomming(): Promise<EventDto[]> {
  const url = BACKEND_DOMAIN + reverse({ pattern: ROUTES.backend.samfundet__eventsupcomming });
  const response = await axios.get<EventDto[]>(url, { withCredentials: true });

  return response.data;
}

export async function getEvents(): Promise<EventDto[]> {
  const url = BACKEND_DOMAIN + reverse({ pattern: ROUTES.backend.samfundet__events_list });
  const response = await axios.get<EventDto[]>(url, { withCredentials: true });

  return response.data;
}

export async function postEvent(data: EventDto): Promise<EventDto> {
  const url = BACKEND_DOMAIN + reverse({ pattern: ROUTES.backend.samfundet__events_list });
  const response = await axios.post<EventDto>(url, data, { withCredentials: true });

  return response.data;
}

export async function putEvent(id: string | number, data: EventDto): Promise<AxiosResponse> {
  const url = BACKEND_DOMAIN + reverse({ pattern: ROUTES.backend.samfundet__events_detail, urlParams: { pk: id } });
  const response = await axios.put<EventDto>(url, data, { withCredentials: true });
  return response;
}

export async function deleteEvent(id: string | number): Promise<AxiosResponse> {
  const url = BACKEND_DOMAIN + reverse({ pattern: ROUTES.backend.samfundet__events_detail, urlParams: { pk: id } });
  const response = await axios.delete<AxiosResponse>(url, { withCredentials: true });

  return response;
}

export async function getEventForm(): Promise<AxiosResponse> {
  const url = BACKEND_DOMAIN + reverse({ pattern: ROUTES.backend.samfundet__eventsform });
  const response = await axios.get<AxiosResponse>(url, { withCredentials: true });

  return response.data;
}

export async function getEvent(pk: string | number): Promise<EventDto> {
  const url = BACKEND_DOMAIN + reverse({ pattern: ROUTES.backend.samfundet__events_detail, urlParams: { pk: pk } });
  const response = await axios.get<EventDto>(url, { withCredentials: true });

  return response.data;
}

export async function getEventGroups(): Promise<EventGroupDto[]> {
  const url = BACKEND_DOMAIN + reverse({ pattern: ROUTES.backend.samfundet__eventgroups_list });
  const response = await axios.get<EventGroupDto[]>(url, { withCredentials: true });

  return response.data;
}

export async function getMenus(): Promise<MenuDto[]> {
  const url = BACKEND_DOMAIN + reverse({ pattern: ROUTES.backend.samfundet__menu_list });
  const response = await axios.get<MenuDto[]>(url, { withCredentials: true });

  return response.data;
}

export async function getMenu(pk: string | number): Promise<MenuDto> {
  const url = BACKEND_DOMAIN + reverse({ pattern: ROUTES.backend.samfundet__menu_detail, urlParams: { pk: pk } });
  const response = await axios.get<MenuDto>(url, { withCredentials: true });

  return response.data;
}

export async function getMenuItems(): Promise<MenuItemDto[]> {
  const url = BACKEND_DOMAIN + reverse({ pattern: ROUTES.backend.samfundet__information_list });
  const response = await axios.get<MenuItemDto[]>(url, { withCredentials: true });

  return response.data;
}

export async function getMenuItem(pk: string | number): Promise<MenuItemDto> {
  const url =
    BACKEND_DOMAIN + reverse({ pattern: ROUTES.backend.samfundet__information_detail, urlParams: { pk: pk } });
  const response = await axios.get<MenuItemDto>(url, { withCredentials: true });

  return response.data;
}

export async function getFoodPreferences(): Promise<FoodPreferenceDto[]> {
  const url = BACKEND_DOMAIN + reverse({ pattern: ROUTES.backend.samfundet__information_list });
  const response = await axios.get<FoodPreferenceDto[]>(url, { withCredentials: true });

  return response.data;
}

export async function getFoodPreference(pk: string | number): Promise<FoodPreferenceDto> {
  const url =
    BACKEND_DOMAIN + reverse({ pattern: ROUTES.backend.samfundet__information_detail, urlParams: { pk: pk } });
  const response = await axios.get<FoodPreferenceDto>(url, { withCredentials: true });

  return response.data;
}

export async function getFoodCategorys(): Promise<FoodCategoryDto[]> {
  const url = BACKEND_DOMAIN + reverse({ pattern: ROUTES.backend.samfundet__information_list });
  const response = await axios.get<FoodCategoryDto[]>(url, { withCredentials: true });

  return response.data;
}

export async function getFoodCategory(pk: string | number): Promise<FoodCategoryDto> {
  const url =
    BACKEND_DOMAIN + reverse({ pattern: ROUTES.backend.samfundet__information_detail, urlParams: { pk: pk } });
  const response = await axios.get<FoodCategoryDto>(url, { withCredentials: true });

  return response.data;
}

export async function getTextItem(pk: string): Promise<TextItemDto> {
  const url = BACKEND_DOMAIN + reverse({ pattern: ROUTES.backend.samfundet__text_item_detail, urlParams: { pk: pk } });
  const response = await axios.get<TextItemDto>(url, { withCredentials: true });
  return response.data;
}
export async function getSaksdokumenter(): Promise<SaksdokumentDto[]> {
  const url = BACKEND_DOMAIN + reverse({ pattern: ROUTES.backend.samfundet__saksdokument_list });
  const response = await axios.get<SaksdokumentDto[]>(url, { withCredentials: true });

  return response.data;
}

export async function getSaksdokument(pk: string | number): Promise<SaksdokumentDto> {
  const url =
    BACKEND_DOMAIN + reverse({ pattern: ROUTES.backend.samfundet__saksdokument_detail, urlParams: { pk: pk } });
  const response = await axios.get<SaksdokumentDto>(url, { withCredentials: true });

  return response.data;
}

export async function getSaksdokumentForm(): Promise<AxiosResponse<{ categories: Array<Array<string>> }>> {
  const url = BACKEND_DOMAIN + reverse({ pattern: ROUTES.backend.samfundet__saksdokumentform });
  const response = await axios.get<{ categories: Array<Array<string>> }>(url, { withCredentials: true });

  return response;
}

export async function postSaksdokument(data: SaksdokumentDto): Promise<SaksdokumentDto> {
  const url = BACKEND_DOMAIN + reverse({ pattern: ROUTES.backend.samfundet__saksdokument_list });
  const response = await axios.post<SaksdokumentDto>(url, data, { withCredentials: true });

  return response.data;
}

export async function putSaksdokument(id: string | number, data: SaksdokumentDto): Promise<AxiosResponse> {
  const url =
    BACKEND_DOMAIN + reverse({ pattern: ROUTES.backend.samfundet__saksdokument_detail, urlParams: { pk: id } });
  const response = await axios.put<SaksdokumentDto>(url, data, { withCredentials: true });
  return response;
}

export async function getGangList(): Promise<GangTypeDto[]> {
  const url = BACKEND_DOMAIN + reverse({ pattern: ROUTES.backend.samfundet__gangsorganized_list });
  const response = await axios.get<GangTypeDto[]>(url, { withCredentials: true });

  return response.data;
}

export async function getGang(id: string | number): Promise<GangDto> {
  const url = BACKEND_DOMAIN + reverse({ pattern: ROUTES.backend.samfundet__gangs_detail, urlParams: { pk: id } });

  const response = await axios.get<GangDto>(url, { withCredentials: true });

  return response.data;
}

export async function getGangs(): Promise<GangDto[]> {
  const url = BACKEND_DOMAIN + reverse({ pattern: ROUTES.backend.samfundet__gangs_list });
  const response = await axios.get<GangDto[]>(url, { withCredentials: true });

  return response.data;
}

export async function postGang(data: GangDto): Promise<GangDto> {
  const url = BACKEND_DOMAIN + reverse({ pattern: ROUTES.backend.samfundet__gangs_list });
  const response = await axios.post<GangDto>(url, data, { withCredentials: true });

  return response.data;
}

export async function putGang(id: string | number, data: GangDto): Promise<AxiosResponse> {
  const url = BACKEND_DOMAIN + reverse({ pattern: ROUTES.backend.samfundet__gangs_detail, urlParams: { pk: id } });
  const response = await axios.put<GangDto>(url, data, { withCredentials: true });
  return response;
}

export async function getGangForm(): Promise<AxiosResponse> {
  const url = BACKEND_DOMAIN + reverse({ pattern: ROUTES.backend.samfundet__gangform });
  const response = await axios.get<AxiosResponse>(url, { withCredentials: true });

  return response.data;
}

export async function getClosedPeriods(): Promise<ClosedPeriodDto[]> {
  const url = BACKEND_DOMAIN + reverse({ pattern: ROUTES.backend.samfundet__closedperiods_list });
  const response = await axios.get<ClosedPeriodDto[]>(url, { withCredentials: true });
  return response.data;
}

export async function getClosedPeriod(id: string | number): Promise<ClosedPeriodDto> {
  const url =
    BACKEND_DOMAIN + reverse({ pattern: ROUTES.backend.samfundet__closedperiods_detail, urlParams: { pk: id } });
  const response = await axios.get<ClosedPeriodDto>(url, { withCredentials: true });
  return response.data;
}

export async function putClosedPeriod(id: string | number, data: ClosedPeriodDto): Promise<AxiosResponse> {
  const url =
    BACKEND_DOMAIN + reverse({ pattern: ROUTES.backend.samfundet__closedperiods_detail, urlParams: { pk: id } });
  const response = await axios.put<ClosedPeriodDto>(url, data, { withCredentials: true });
  return response;
}

export async function postClosedPeriod(data: ClosedPeriodDto): Promise<ClosedPeriodDto> {
  const url = BACKEND_DOMAIN + reverse({ pattern: ROUTES.backend.samfundet__closedperiods_list });
  const response = await axios.post<ClosedPeriodDto>(url, data, { withCredentials: true });
  return response.data;
}

export async function deleteClosedPeriod(id: string | number): Promise<AxiosResponse> {
  const url =
    BACKEND_DOMAIN + reverse({ pattern: ROUTES.backend.samfundet__closedperiods_detail, urlParams: { pk: id } });
  const response = await axios.delete<AxiosResponse>(url, { withCredentials: true });
  return response;
}

export async function getImages(): Promise<ImageDto[]> {
  const url = BACKEND_DOMAIN + reverse({ pattern: ROUTES.backend.samfundet__images_list });
  const response = await axios.get<ImageDto[]>(url, { withCredentials: true });
  return response.data;
}

export async function getImage(id: string | number): Promise<ImageDto> {
  const url = BACKEND_DOMAIN + reverse({ pattern: ROUTES.backend.samfundet__images_detail, urlParams: { pk: id } });
  const response = await axios.get<ImageDto>(url, { withCredentials: true });
  return response.data;
}

export async function postImage(data: ImageDto): Promise<ImageDto> {
  const url = BACKEND_DOMAIN + reverse({ pattern: ROUTES.backend.samfundet__images_list });
  const response = await axios.post<ImageDto>(url, data, { withCredentials: true });
  return response.data;
}

export async function putImage(id: string | number, data: ImageDto): Promise<AxiosResponse> {
  const url = BACKEND_DOMAIN + reverse({ pattern: ROUTES.backend.samfundet__images_detail, urlParams: { pk: id } });
  const response = await axios.put<ImageDto>(url, data, { withCredentials: true });
  return response;
}
