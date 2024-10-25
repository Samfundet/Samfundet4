import axios, { type AxiosResponse } from 'axios';
import type {
  ClosedPeriodDto,
  EventDto,
  EventGroupDto,
  FeedbackDto,
  FoodCategoryDto,
  FoodPreferenceDto,
  GangDto,
  GangTypeDto,
  HomePageDto,
  ImageDto,
  ImagePostDto,
  InformationPageDto,
  InterviewDto,
  InterviewRoomDto,
  KeyValueDto,
  MailDto,
  MenuDto,
  MenuItemDto,
  OccupiedTimeslotDto,
  OrganizationDto,
  PurchaseFeedbackDto,
  RecruitmentApplicationDto,
  RecruitmentApplicationRecruiterDto,
  RecruitmentApplicationStateChoicesDto,
  RecruitmentApplicationStateDto,
  RecruitmentAvailabilityDto,
  RecruitmentDto,
  RecruitmentGangDto,
  RecruitmentPositionDto,
  RecruitmentPositionPostDto,
  RecruitmentPositionPutDto,
  RecruitmentSeparatePositionDto,
  RecruitmentStatsDto,
  RecruitmentUnprocessedApplicationsDto,
  RecruitmentUserDto,
  RegistrationDto,
  RoleDto,
  SaksdokumentDto,
  TextItemDto,
  UserDto,
  UserPreferenceDto,
  UserPriorityDto,
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

export async function register(data: RegistrationDto): Promise<number> {
  const url = BACKEND_DOMAIN + ROUTES.backend.samfundet__register;
  const response = await axios.post(url, data, { withCredentials: true });

  // Django rotates csrftoken after login, set new token received.
  const new_token = response.data;
  axios.defaults.headers.common['X-CSRFToken'] = new_token;

  return response.status;
}

export async function getUser(): Promise<UserDto> {
  const url = BACKEND_DOMAIN + ROUTES.backend.samfundet__user;
  const response = await axios.get<UserDto>(url, { withCredentials: true });

  return response.data;
}

export async function stopImpersonatingUser(): Promise<boolean> {
  const url = BACKEND_DOMAIN + ROUTES.backend.samfundet__impersonate;
  const response = await axios.post(url, {}, { withCredentials: true });
  return response.status === 200;
}

export async function impersonateUser(userId: number): Promise<boolean> {
  const url = BACKEND_DOMAIN + ROUTES.backend.samfundet__impersonate;
  const response = await axios.post(url, { user_id: userId }, { withCredentials: true });
  return response.status === 200;
}

export async function getUsers(): Promise<UserDto[]> {
  const url = BACKEND_DOMAIN + ROUTES.backend.samfundet__users;
  const response = await axios.get<UserDto[]>(url, { withCredentials: true });
  return response.data;
}

export async function assignUserToGroup(username: string, group_name: string): Promise<AxiosResponse> {
  const url = BACKEND_DOMAIN + ROUTES.backend.samfundet__assign_group;
  const payload = {
    username,
    group_name,
  };
  const response = await axios.post(url, payload, { withCredentials: true });

  return response;
}

export async function getHomeData(): Promise<HomePageDto> {
  const url = BACKEND_DOMAIN + ROUTES.backend.samfundet__home;
  const response = await axios.get<HomePageDto>(url, { withCredentials: true });

  return response.data;
}

export async function putUserPreference(id: string | number, data: Partial<UserPreferenceDto>): Promise<unknown> {
  const url =
    BACKEND_DOMAIN +
    reverse({
      pattern: ROUTES.backend.samfundet__user_preference_detail,
      urlParams: { pk: id },
    });
  const response = await axios.put<UserPreferenceDto>(url, data, { withCredentials: true });

  return response.data;
}

export async function getVenues(): Promise<VenueDto[]> {
  const url = BACKEND_DOMAIN + ROUTES.backend.samfundet__venues_list;
  const response = await axios.get<VenueDto[]>(url, { withCredentials: true });

  return response.data;
}

export async function getVenue(id: string | number): Promise<VenueDto> {
  const url = BACKEND_DOMAIN + reverse({ pattern: ROUTES.backend.samfundet__venues_detail, urlParams: { pk: id } });
  const response = await axios.get<VenueDto>(url, { withCredentials: true });

  return response.data;
}

export async function putVenue(slug: string | number, venue: Partial<VenueDto>): Promise<VenueDto> {
  const url = BACKEND_DOMAIN + reverse({ pattern: ROUTES.backend.samfundet__venues_detail, urlParams: { slug: slug } });
  const response = await axios.put<VenueDto>(url, venue, { withCredentials: true });
  return response.data;
}

export async function getInformationPages(): Promise<InformationPageDto[]> {
  const url = BACKEND_DOMAIN + ROUTES.backend.samfundet__information_list;
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
  const url = BACKEND_DOMAIN + ROUTES.backend.samfundet__information_list;
  const response = await axios.post<InformationPageDto>(url, data, { withCredentials: true });
  return response.data;
}

export async function putInformationPage(
  slug_field: string,
  page: Partial<InformationPageDto>,
): Promise<AxiosResponse> {
  const url =
    BACKEND_DOMAIN + reverse({ pattern: ROUTES.backend.samfundet__information_detail, urlParams: { pk: slug_field } });
  const response = await axios.put<InformationPageDto>(url, page, { withCredentials: true });
  return response;
}

export async function getEventsPerDay(): Promise<EventDto[]> {
  const url = BACKEND_DOMAIN + ROUTES.backend.samfundet__eventsperday;
  const response = await axios.get<EventDto[]>(url, { withCredentials: true });

  return response.data;
}

export async function getEventsUpcomming(): Promise<EventDto[]> {
  const url = BACKEND_DOMAIN + ROUTES.backend.samfundet__eventsupcomming;
  const response = await axios.get<EventDto[]>(url, { withCredentials: true });

  return response.data;
}

export async function getEvents(): Promise<EventDto[]> {
  const url = BACKEND_DOMAIN + ROUTES.backend.samfundet__events_list;
  const response = await axios.get<EventDto[]>(url, { withCredentials: true });

  return response.data;
}

export async function postEvent(data: EventDto): Promise<AxiosResponse<EventDto>> {
  const transformed = { ...data, image_id: data.image?.id };
  const url = BACKEND_DOMAIN + ROUTES.backend.samfundet__events_list;
  const response = await axios.post<EventDto>(url, transformed, { withCredentials: true });
  return response;
}

export async function putEvent(id: string | number, data: Partial<EventDto>): Promise<AxiosResponse<EventDto>> {
  const url = BACKEND_DOMAIN + reverse({ pattern: ROUTES.backend.samfundet__events_detail, urlParams: { pk: id } });
  const response = await axios.put<EventDto>(url, data, { withCredentials: true });
  return response;
}

export async function deleteEvent(id: string | number): Promise<AxiosResponse> {
  const url = BACKEND_DOMAIN + reverse({ pattern: ROUTES.backend.samfundet__events_detail, urlParams: { pk: id } });
  const response = await axios.delete<AxiosResponse>(url, { withCredentials: true });
  return response;
}

export async function getEvent(pk: string | number): Promise<EventDto> {
  const url = BACKEND_DOMAIN + reverse({ pattern: ROUTES.backend.samfundet__events_detail, urlParams: { pk: pk } });
  const response = await axios.get<EventDto>(url, { withCredentials: true });

  return response.data;
}

export async function getEventGroups(): Promise<EventGroupDto[]> {
  const url = BACKEND_DOMAIN + ROUTES.backend.samfundet__eventgroups_list;
  const response = await axios.get<EventGroupDto[]>(url, { withCredentials: true });

  return response.data;
}

export async function getMenus(): Promise<MenuDto[]> {
  const url = BACKEND_DOMAIN + ROUTES.backend.samfundet__menu_list;
  const response = await axios.get<MenuDto[]>(url, { withCredentials: true });

  return response.data;
}

export async function getMenu(pk: string | number): Promise<MenuDto> {
  const url = BACKEND_DOMAIN + reverse({ pattern: ROUTES.backend.samfundet__menu_detail, urlParams: { pk: pk } });
  const response = await axios.get<MenuDto>(url, { withCredentials: true });

  return response.data;
}

export async function getMenuItems(): Promise<MenuItemDto[]> {
  const url = BACKEND_DOMAIN + ROUTES.backend.samfundet__menu_items_list;
  const response = await axios.get<MenuItemDto[]>(url, { withCredentials: true });

  return response.data;
}

export async function getMenuItem(pk: string | number): Promise<MenuItemDto> {
  const url = BACKEND_DOMAIN + reverse({ pattern: ROUTES.backend.samfundet__menu_items_detail, urlParams: { pk: pk } });
  const response = await axios.get<MenuItemDto>(url, { withCredentials: true });

  return response.data;
}

export async function putMenuItem(pk: string | number, data: Partial<MenuItemDto>): Promise<MenuItemDto> {
  const url = BACKEND_DOMAIN + reverse({ pattern: ROUTES.backend.samfundet__menu_items_detail, urlParams: { pk: pk } });
  const response = await axios.put<MenuItemDto>(url, data, { withCredentials: true });

  return response.data;
}

export async function postMenuItem(data: Partial<MenuItemDto>): Promise<MenuItemDto> {
  const url = BACKEND_DOMAIN + ROUTES.backend.samfundet__menu_items_list;
  const response = await axios.post<MenuItemDto>(url, data, { withCredentials: true });

  return response.data;
}

export async function getFoodPreferences(): Promise<FoodPreferenceDto[]> {
  const url = BACKEND_DOMAIN + ROUTES.backend.samfundet__food_preference_list;
  const response = await axios.get<FoodPreferenceDto[]>(url, { withCredentials: true });

  return response.data;
}

export async function getFoodPreference(pk: string | number): Promise<FoodPreferenceDto> {
  const url =
    BACKEND_DOMAIN + reverse({ pattern: ROUTES.backend.samfundet__food_preference_detail, urlParams: { pk: pk } });
  const response = await axios.get<FoodPreferenceDto>(url, { withCredentials: true });

  return response.data;
}

export async function getFoodCategories(): Promise<FoodCategoryDto[]> {
  const url = BACKEND_DOMAIN + ROUTES.backend.samfundet__food_category_list;
  const response = await axios.get<FoodCategoryDto[]>(url, { withCredentials: true });

  return response.data;
}

export async function getFoodCategory(pk: string | number): Promise<FoodCategoryDto> {
  const url =
    BACKEND_DOMAIN + reverse({ pattern: ROUTES.backend.samfundet__food_category_detail, urlParams: { pk: pk } });
  const response = await axios.get<FoodCategoryDto>(url, { withCredentials: true });

  return response.data;
}

export async function getTextItem(pk: string): Promise<TextItemDto> {
  const url = BACKEND_DOMAIN + reverse({ pattern: ROUTES.backend.samfundet__text_item_detail, urlParams: { pk: pk } });
  const response = await axios.get<TextItemDto>(url, { withCredentials: true });
  return response.data;
}

export async function getSaksdokumenter(): Promise<SaksdokumentDto[]> {
  const url = BACKEND_DOMAIN + ROUTES.backend.samfundet__saksdokument_list;
  const response = await axios.get<SaksdokumentDto[]>(url, { withCredentials: true });

  return response.data;
}

export async function getSaksdokument(pk: string | number): Promise<SaksdokumentDto> {
  const url =
    BACKEND_DOMAIN + reverse({ pattern: ROUTES.backend.samfundet__saksdokument_detail, urlParams: { pk: pk } });
  const response = await axios.get<SaksdokumentDto>(url, { withCredentials: true });

  return response.data;
}

export async function postSaksdokument(data: SaksdokumentDto): Promise<SaksdokumentDto> {
  const url = BACKEND_DOMAIN + ROUTES.backend.samfundet__saksdokument_list;
  const response = await axios.postForm<SaksdokumentDto>(url, data, {
    withCredentials: true,
  });
  return response.data;
}

export async function putSaksdokument(id: string | number, data: Partial<SaksdokumentDto>): Promise<AxiosResponse> {
  const url =
    BACKEND_DOMAIN + reverse({ pattern: ROUTES.backend.samfundet__saksdokument_detail, urlParams: { pk: id } });
  const response = await axios.put<SaksdokumentDto>(url, data, { withCredentials: true });
  return response;
}

export async function getOrganizations(): Promise<OrganizationDto[]> {
  const url = BACKEND_DOMAIN + ROUTES.backend.samfundet__organizations_list;
  const response = await axios.get<OrganizationDto[]>(url, { withCredentials: true });

  return response.data;
}

export async function getOrganization(id: number | undefined): Promise<OrganizationDto> {
  const url =
    BACKEND_DOMAIN + reverse({ pattern: ROUTES.backend.samfundet__organizations_detail, urlParams: { pk: id } });
  const response = await axios.get<OrganizationDto>(url, { withCredentials: true });

  return response.data;
}

export async function getGangList(): Promise<GangTypeDto[]> {
  const url = BACKEND_DOMAIN + ROUTES.backend.samfundet__gangsorganized_list;
  const response = await axios.get<GangTypeDto[]>(url, { withCredentials: true });

  return response.data;
}

export async function getGang(id: string | number): Promise<GangDto> {
  const url = BACKEND_DOMAIN + reverse({ pattern: ROUTES.backend.samfundet__gangs_detail, urlParams: { pk: id } });
  const response = await axios.get<GangDto>(url, { withCredentials: true });

  return response.data;
}

export async function getRecruitmentGangs(recruitmentId: string | number): Promise<RecruitmentGangDto[]> {
  const url =
    BACKEND_DOMAIN +
    reverse({ pattern: ROUTES.backend.samfundet__recruitment_gangs, urlParams: { pk: recruitmentId } });
  const response = await axios.get<RecruitmentGangDto[]>(url, { withCredentials: true });
  return response.data;
}

export async function getGangsByOrganization(id: string | number): Promise<GangDto[]> {
  const url =
    BACKEND_DOMAIN + reverse({ pattern: ROUTES.backend.samfundet__organizations_gangs, urlParams: { pk: id } });
  const response = await axios.get<GangDto[]>(url, { withCredentials: true });
  return response.data;
}

export async function getGangs(): Promise<GangDto[]> {
  const url = BACKEND_DOMAIN + reverse({ pattern: ROUTES.backend.samfundet__gangs_list });
  const response = await axios.get<GangDto[]>(url, { withCredentials: true });

  return response.data;
}

export async function postGang(data: Partial<GangDto>): Promise<GangDto> {
  const url = BACKEND_DOMAIN + ROUTES.backend.samfundet__gangs_list;
  const response = await axios.post<GangDto>(url, data, { withCredentials: true });

  return response.data;
}

export async function putGang(id: string | number, data: Partial<GangDto>): Promise<AxiosResponse> {
  const url = BACKEND_DOMAIN + reverse({ pattern: ROUTES.backend.samfundet__gangs_detail, urlParams: { pk: id } });
  const response = await axios.put<GangDto>(url, data, { withCredentials: true });
  return response;
}

export async function getClosedPeriods(): Promise<ClosedPeriodDto[]> {
  const url = BACKEND_DOMAIN + ROUTES.backend.samfundet__closedperiods_list;
  const response = await axios.get<ClosedPeriodDto[]>(url, { withCredentials: true });
  return response.data;
}

export async function getClosedPeriod(id: string | number): Promise<ClosedPeriodDto> {
  const url =
    BACKEND_DOMAIN + reverse({ pattern: ROUTES.backend.samfundet__closedperiods_detail, urlParams: { pk: id } });
  const response = await axios.get<ClosedPeriodDto>(url, { withCredentials: true });
  return response.data;
}

export async function putClosedPeriod(id: string | number, data: Partial<ClosedPeriodDto>): Promise<AxiosResponse> {
  const url =
    BACKEND_DOMAIN + reverse({ pattern: ROUTES.backend.samfundet__closedperiods_detail, urlParams: { pk: id } });
  const response = await axios.put<ClosedPeriodDto>(url, data, { withCredentials: true });
  return response;
}

export async function postClosedPeriod(data: ClosedPeriodDto): Promise<ClosedPeriodDto> {
  const url = BACKEND_DOMAIN + ROUTES.backend.samfundet__closedperiods_list;
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
  const url = BACKEND_DOMAIN + ROUTES.backend.samfundet__images_list;
  const response = await axios.get<ImageDto[]>(url, { withCredentials: true });
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

export async function putImage(id: string | number, data: Partial<ImageDto>): Promise<AxiosResponse> {
  const url = BACKEND_DOMAIN + reverse({ pattern: ROUTES.backend.samfundet__images_detail, urlParams: { pk: id } });
  const response = await axios.put<ImageDto>(url, data, { withCredentials: true });
  return response;
}

/** Fetch all KeyValues from backend. */
export function getKeyValues(): Promise<AxiosResponse<KeyValueDto[]>> {
  const url = BACKEND_DOMAIN + ROUTES.backend.samfundet__key_value_list;
  const response = axios.get<KeyValueDto[]>(url);
  return response;
}

// ############################################################
//                       Recruitment
// ############################################################

export async function getAllRecruitments(): Promise<AxiosResponse<RecruitmentDto[]>> {
  const url = BACKEND_DOMAIN + ROUTES.backend.samfundet__recruitment_list;
  const response = await axios.get(url, { withCredentials: true });

  return response;
}

export async function getRecruitment(id: string): Promise<AxiosResponse<RecruitmentDto>> {
  const url =
    BACKEND_DOMAIN + reverse({ pattern: ROUTES.backend.samfundet__recruitment_detail, urlParams: { pk: id } });
  const response = await axios.get(url, { withCredentials: true });

  return response;
}

// Issue #1520 TODO: Setup backend later. Using test data now.
export async function getRole(id: string): Promise<RoleDto> {
  //const url = BACKEND_DOMAIN + reverse({ pattern: ROUTES.backend.samfundet__api_, urlParams: ( pk: id ) }):
  //const response = await axios.get(url, { withCredentials: true });
  const role = {
    id: 1,
    name: 'Opptaksansvarlig',
    permissions: ['samfundet.test_permission', 'samfundet.user_create'],
  };
  return role;
}

export async function postRecruitment(recruitmentData: RecruitmentDto): Promise<AxiosResponse> {
  const url = BACKEND_DOMAIN + ROUTES.backend.samfundet__recruitment_list;
  const response = await axios.post(url, recruitmentData, { withCredentials: true });

  return response;
}

export async function putRecruitment(id: string, recruitment: Partial<RecruitmentDto>): Promise<AxiosResponse> {
  const url =
    BACKEND_DOMAIN + reverse({ pattern: ROUTES.backend.samfundet__recruitment_detail, urlParams: { pk: id } });
  const response = await axios.put<RecruitmentDto>(url, recruitment, { withCredentials: true });
  return response;
}

export async function getRecruitmentPositions(recruitmentId: string): Promise<AxiosResponse<RecruitmentPositionDto[]>> {
  const url =
    BACKEND_DOMAIN +
    reverse({
      pattern: ROUTES.backend.samfundet__recruitment_positions,
      queryParams: { recruitment: recruitmentId },
    });
  const response = await axios.get(url, { withCredentials: true });

  return response;
}

export async function getRecruitmentPositionsGangForApplicant(
  recruitmentId: number | string,
  gangId: number | string | undefined,
): Promise<AxiosResponse<RecruitmentPositionDto[]>> {
  const url =
    BACKEND_DOMAIN +
    reverse({
      pattern: ROUTES.backend.samfundet__recruitment_positions_gang_for_applicants,
      queryParams: { recruitment: recruitmentId, gang: gangId },
    });
  const response = await axios.get(url, { withCredentials: true });

  return response;
}

export async function getRecruitmentPositionsGangForGang(
  recruitmentId: string,
  gangId: number | string | undefined,
): Promise<AxiosResponse<RecruitmentPositionDto[]>> {
  const url =
    BACKEND_DOMAIN +
    reverse({
      pattern: ROUTES.backend.samfundet__recruitment_positions_gang_for_gangs,
      queryParams: { recruitment: recruitmentId, gang: gangId },
    });
  const response = await axios.get(url, { withCredentials: true });

  return response;
}

export async function getRecruitmentAvailability(
  recruitmentId: number,
): Promise<AxiosResponse<RecruitmentAvailabilityDto>> {
  const url =
    BACKEND_DOMAIN +
    reverse({
      pattern: ROUTES.backend.samfundet__recruitment_availability,
      urlParams: { id: recruitmentId },
    });
  return await axios.get(url, { withCredentials: true });
}

export async function getOccupiedTimeslots(recruitmentId: number): Promise<AxiosResponse<OccupiedTimeslotDto>> {
  const url =
    BACKEND_DOMAIN +
    reverse({
      pattern: ROUTES.backend.samfundet__occupied_timeslots,
      queryParams: { recruitment: recruitmentId },
    });
  const response = await axios.get(url, { withCredentials: true });

  return response;
}

export async function postOccupiedTimeslots(
  timeslots: OccupiedTimeslotDto,
): Promise<AxiosResponse<OccupiedTimeslotDto>> {
  const url = BACKEND_DOMAIN + ROUTES.backend.samfundet__occupied_timeslots;
  const response = await axios.post(url, timeslots, { withCredentials: true });

  return response;
}

export async function getRecruitmentPositionForApplicant(
  positionId: string,
): Promise<AxiosResponse<RecruitmentPositionDto>> {
  const url =
    BACKEND_DOMAIN +
    reverse({
      pattern: ROUTES.backend.samfundet__recruitment_position_for_applicant_detail,
      urlParams: { pk: positionId },
    });
  const response = await axios.get(url, { withCredentials: true });

  return response;
}

export async function getRecruitmentPosition(positionId: string): Promise<AxiosResponse<RecruitmentPositionDto>> {
  const url =
    BACKEND_DOMAIN +
    reverse({ pattern: ROUTES.backend.samfundet__recruitment_position_detail, urlParams: { pk: positionId } });
  const response = await axios.get(url, { withCredentials: true });

  return response;
}

export async function postRecruitmentPosition(recruitmentPosition: RecruitmentPositionPutDto): Promise<AxiosResponse> {
  const url = BACKEND_DOMAIN + ROUTES.backend.samfundet__recruitment_position_list;
  const response = await axios.post(url, recruitmentPosition, { withCredentials: true });

  return response;
}

export async function putRecruitmentPosition(
  positionId: string,
  recruitment: Partial<RecruitmentPositionPostDto>,
): Promise<AxiosResponse> {
  const url =
    BACKEND_DOMAIN +
    reverse({ pattern: ROUTES.backend.samfundet__recruitment_position_detail, urlParams: { pk: positionId } });
  const response = await axios.put<RecruitmentPositionDto>(url, recruitment, { withCredentials: true });
  return response;
}

export async function getRecruitmentSeparatePosition(
  separatePositionId: string,
): Promise<AxiosResponse<RecruitmentSeparatePositionDto>> {
  const url =
    BACKEND_DOMAIN +
    reverse({
      pattern: ROUTES.backend.samfundet__recruitment_separateposition_detail,
      urlParams: { pk: separatePositionId },
    });
  return await axios.get(url, { withCredentials: true });
}

export async function postRecruitmentSeparatePosition(
  recruitmentSeparatePosition: RecruitmentSeparatePositionDto,
): Promise<AxiosResponse> {
  const url = BACKEND_DOMAIN + ROUTES.backend.samfundet__recruitment_separateposition_list;

  return await axios.post(url, recruitmentSeparatePosition, { withCredentials: true });
}

export async function putRecruitmentSeparatePosition(
  separatePositionId: string,
  recruitmentSeparatePosition: Partial<RecruitmentSeparatePositionDto>,
): Promise<AxiosResponse> {
  const url =
    BACKEND_DOMAIN +
    reverse({
      pattern: ROUTES.backend.samfundet__recruitment_separateposition_detail,
      urlParams: { pk: separatePositionId },
    });
  return await axios.put<RecruitmentPositionDto>(url, recruitmentSeparatePosition, { withCredentials: true });
}

export async function deleteRecruitmentSeparatePosition(separatePositionId: string): Promise<AxiosResponse> {
  const url =
    BACKEND_DOMAIN +
    reverse({
      pattern: ROUTES.backend.samfundet__recruitment_separateposition_detail,
      urlParams: { pk: separatePositionId },
    });
  return await axios.delete<RecruitmentPositionDto>(url, { withCredentials: true });
}

export async function getRecruitmentRecruiterDashboard(recruitmentId: string): Promise<AxiosResponse> {
  const url =
    BACKEND_DOMAIN +
    reverse({ pattern: ROUTES.backend.samfundet__recruitment_recruiter_dashboard, urlParams: { pk: recruitmentId } });
  return await axios.get<RecruitmentPositionDto>(url, { withCredentials: true });
}

export async function setRecruitmentApplicationInterview(
  applicationId: string,
  data: InterviewDto,
): Promise<AxiosResponse<RecruitmentApplicationDto>> {
  const url =
    BACKEND_DOMAIN +
    reverse({
      pattern: ROUTES.backend.samfundet__recruitment_set_interview,
      urlParams: { pk: applicationId },
    });
  return await axios.put(url, data, { withCredentials: true });
}

export async function getRecruitmentApplicationsForApplicant(
  recruitmentId: string,
): Promise<AxiosResponse<RecruitmentApplicationDto[]>> {
  const url =
    BACKEND_DOMAIN +
    reverse({
      pattern: ROUTES.backend.samfundet__recruitment_applications_for_applicant_list,
      queryParams: { recruitment: recruitmentId },
    });
  const response = await axios.get(url, { withCredentials: true });

  return response;
}

export async function getRecruitmentApplicationsForRecruiter(
  applicationID: string,
): Promise<AxiosResponse<RecruitmentApplicationRecruiterDto>> {
  const url =
    BACKEND_DOMAIN +
    reverse({
      pattern: ROUTES.backend.samfundet__recruitment_applications_recruiter,
      urlParams: { applicationId: applicationID },
    });
  const response = await axios.get(url, { withCredentials: true });

  return response;
}

export async function getRecruitmentUnprocessedApplicants(
  recruitmentId: string,
): Promise<AxiosResponse<RecruitmentUnprocessedApplicationsDto[]>> {
  const url =
    BACKEND_DOMAIN +
    reverse({
      pattern: ROUTES.backend.samfundet__recruitment_show_unprocessed_applicants,
      queryParams: { recruitment: recruitmentId },
    });
  const response = await axios.get(url, { withCredentials: true });

  return response;
}

export async function putRecruitmentPriorityForUser(
  applicationId: string,
  data: UserPriorityDto,
): Promise<AxiosResponse<RecruitmentApplicationDto[]>> {
  const url =
    BACKEND_DOMAIN +
    reverse({
      pattern: ROUTES.backend.samfundet__recruitment_user_priority_update,
      urlParams: { pk: applicationId },
    });
  return await axios.put(url, data, { withCredentials: true });
}

export async function getRecruitmentApplicantForApplicant(
  recruitment_position: string,
): Promise<AxiosResponse<RecruitmentApplicationDto>> {
  const url =
    BACKEND_DOMAIN +
    reverse({
      pattern: ROUTES.backend.samfundet__recruitment_applications_for_applicant_detail,
      urlParams: { pk: recruitment_position },
    });
  return await axios.get(url, { withCredentials: true });
}

export async function getRecruitmentApplicationsForGang(
  gangId: string,
  recruitmentId: string,
): Promise<AxiosResponse<RecruitmentApplicationDto[]>> {
  const url =
    BACKEND_DOMAIN +
    reverse({
      pattern: ROUTES.backend.samfundet__recruitment_applications_for_gang_list,
      queryParams: {
        gang: gangId,
        recruitment: recruitmentId,
      },
    });
  return await axios.get(url, { withCredentials: true });
}

export async function downloadCSVGangRecruitment(recruitmentId: string, gangId: string): Promise<void> {
  const url =
    BACKEND_DOMAIN +
    reverse({
      pattern: ROUTES.backend.samfundet__recruitment_download_gang_application_csv,
      urlParams: {
        gangId: gangId,
        recruitmentId: recruitmentId,
      },
    });
  window.open(url);
}

export async function getRecruitmentApplicationsForRecruitmentPosition(
  recruitmentPositionId: string,
): Promise<AxiosResponse<RecruitmentApplicationDto[]>> {
  const url =
    BACKEND_DOMAIN +
    reverse({
      pattern: ROUTES.backend.samfundet__recruitment_applications_for_gang_detail,
      urlParams: { pk: recruitmentPositionId },
    });
  return await axios.get(url, { withCredentials: true });
}

export async function putRecruitmentApplicationForGang(
  applicationId: string,
  application: Partial<RecruitmentApplicationDto>,
): Promise<AxiosResponse> {
  const url =
    BACKEND_DOMAIN +
    reverse({
      pattern: ROUTES.backend.samfundet__recruitment_applications_for_gang_detail,
      urlParams: { pk: applicationId },
    });
  const response = await axios.put<RecruitmentApplicationDto>(url, application, { withCredentials: true });
  return response;
}

export async function updateRecruitmentApplicationStateForGang(
  applicationId: string,
  application: Partial<RecruitmentApplicationStateDto>,
): Promise<AxiosResponse<RecruitmentApplicationDto[]>> {
  const url =
    BACKEND_DOMAIN +
    reverse({
      pattern: ROUTES.backend.samfundet__recruitment_application_update_state_gang,
      urlParams: { pk: applicationId },
    });
  return await axios.put(url, application, { withCredentials: true });
}

export async function updateRecruitmentApplicationStateForPosition(
  applicationId: string,
  application: Partial<RecruitmentApplicationStateDto>,
): Promise<AxiosResponse<RecruitmentApplicationDto[]>> {
  const url =
    BACKEND_DOMAIN +
    reverse({
      pattern: ROUTES.backend.samfundet__recruitment_application_update_state_position,
      urlParams: { pk: applicationId },
    });
  return await axios.put(url, application, { withCredentials: true });
}

export async function getRecruitmentApplicationStateChoices(): Promise<
  AxiosResponse<RecruitmentApplicationStateChoicesDto>
> {
  const url = BACKEND_DOMAIN + ROUTES.backend.samfundet__recruitment_application_states_choices;
  return await axios.get(url, { withCredentials: true });
}

export async function getActiveRecruitmentPositions(): Promise<AxiosResponse<RecruitmentPositionDto[]>> {
  const url = BACKEND_DOMAIN + ROUTES.backend.samfundet__active_recruitment_positions;
  const response = await axios.get(url, { withCredentials: true });

  return response;
}

export async function getActiveRecruitments(): Promise<AxiosResponse<RecruitmentDto[]>> {
  const url = BACKEND_DOMAIN + ROUTES.backend.samfundet__active_recruitments;
  const response = await axios.get(url, { withCredentials: true });

  return response;
}

export async function getApplicantsWithoutInterviews(
  recruitmentId: string,
  gangId: string | null = null,
): Promise<AxiosResponse<RecruitmentUserDto[]>> {
  const url =
    BACKEND_DOMAIN +
    reverse({
      pattern: ROUTES.backend.samfundet__applicants_without_interviews,
      urlParams: { pk: recruitmentId },
      queryParams: gangId ? { recruitment: recruitmentId, gang: gangId } : { recruitment: recruitmentId },
    });
  return await axios.get(url, { withCredentials: true });
}

export async function getApplicantsWithoutThreeInterviewCriteria(
  recruitmentId: string,
): Promise<AxiosResponse<RecruitmentUserDto[]>> {
  const url =
    BACKEND_DOMAIN +
    reverse({
      pattern: ROUTES.backend.samfundet__applicants_without_three_interview_criteria,
      urlParams: { pk: recruitmentId },
    });
  return await axios.get(url, { withCredentials: true });
}

export async function putRecruitmentApplication(
  application: Partial<RecruitmentApplicationDto>,
  applicationId: number,
): Promise<AxiosResponse> {
  const url =
    BACKEND_DOMAIN +
    reverse({
      pattern: ROUTES.backend.samfundet__recruitment_applications_for_applicant_detail,
      urlParams: { pk: applicationId },
    });
  const data = {
    application_text: application.application_text,
    recruitment_position: application.recruitment_position,
  };
  const response = await axios.put(url, data, { withCredentials: true });

  return response;
}

export async function getRecruitmentApplicationForPosition(
  positionId: string,
): Promise<AxiosResponse<RecruitmentApplicationDto>> {
  const url =
    BACKEND_DOMAIN +
    reverse({
      pattern: ROUTES.backend.samfundet__recruitment_applications_for_applicant_detail,
      urlParams: { pk: positionId },
    });
  const response = await axios.get(url, { withCredentials: true });

  return response;
}

export async function withdrawRecruitmentApplicationApplicant(positionId: number | string): Promise<AxiosResponse> {
  const url =
    BACKEND_DOMAIN +
    reverse({
      pattern: ROUTES.backend.samfundet__recruitment_withdraw_application,
      urlParams: { pk: positionId },
    });
  const response = await axios.put(url, {}, { withCredentials: true });

  return response;
}

export async function withdrawRecruitmentApplicationRecruiter(id: string): Promise<AxiosResponse> {
  const url =
    BACKEND_DOMAIN +
    reverse({
      pattern: ROUTES.backend.samfundet__recruitment_withdraw_application_recruiter,
      urlParams: { pk: id },
    });
  return await axios.put(url, {}, { withCredentials: true });
}

export async function putRecruitmentApplicationInterview(
  interviewId: string | number,
  interview: Partial<InterviewDto>,
): Promise<AxiosResponse> {
  const url =
    BACKEND_DOMAIN +
    reverse({
      pattern: ROUTES.backend.samfundet__interview_detail,
      urlParams: { pk: interviewId.toString() },
    });
  const response = await axios.put<InterviewDto>(url, interview, { withCredentials: true });
  return response;
}

export async function getInterview(interviewId: number): Promise<AxiosResponse<InterviewDto>> {
  const url =
    BACKEND_DOMAIN +
    reverse({
      pattern: ROUTES.backend.samfundet__interview_detail,
      urlParams: { pk: interviewId },
    });
  return await axios.get(url, { withCredentials: true });
}

// ############################################################
//                       Interview rooms
// ############################################################

export async function getInterviewRoomsForRecruitment(
  recruitmentId: string,
): Promise<AxiosResponse<InterviewRoomDto[]>> {
  const url =
    BACKEND_DOMAIN +
    reverse({
      pattern: ROUTES.backend.samfundet__interview_rooms_list,
      queryParams: { recruitment: recruitmentId },
    });
  return await axios.get(url, { withCredentials: true });
}

export async function getInterviewRoom(id: string): Promise<AxiosResponse<InterviewRoomDto>> {
  const url =
    BACKEND_DOMAIN + reverse({ pattern: ROUTES.backend.samfundet__interview_rooms_detail, urlParams: { pk: id } });
  return await axios.get(url, { withCredentials: true });
}

export async function postInterviewRoom(data: Partial<InterviewRoomDto>): Promise<AxiosResponse> {
  const url = BACKEND_DOMAIN + ROUTES.backend.samfundet__interview_rooms_list;
  return await axios.post(url, data, { withCredentials: true });
}

export async function putInterviewRoom(id: string, data: Partial<InterviewRoomDto>): Promise<AxiosResponse> {
  const url =
    BACKEND_DOMAIN + reverse({ pattern: ROUTES.backend.samfundet__interview_rooms_detail, urlParams: { pk: id } });
  return await axios.put(url, data, { withCredentials: true });
}

export async function deleteInterviewRoom(id: string): Promise<AxiosResponse> {
  const url =
    BACKEND_DOMAIN + reverse({ pattern: ROUTES.backend.samfundet__interview_rooms_detail, urlParams: { pk: id } });
  return await axios.delete(url, { withCredentials: true });
}

// ############################################################
//                       Purchase Feedback
// ############################################################

export async function postPurchaseFeedback(feedback: PurchaseFeedbackDto): Promise<PurchaseFeedbackDto> {
  const url = BACKEND_DOMAIN + ROUTES.backend.samfundet__purchase_feedback;
  const response = await axios.post<PurchaseFeedbackDto>(url, feedback, { withCredentials: true });
  return response.data;
}

export async function getRecruitmentStats(id: string): Promise<RecruitmentStatsDto> {
  const url =
    BACKEND_DOMAIN + reverse({ pattern: ROUTES.backend.samfundet__recruitment_stats_detail, urlParams: { pk: id } });
  const response = await axios.get(url, { withCredentials: true });

  return response.data;
}

export async function postFeedback(feedbackData: FeedbackDto): Promise<AxiosResponse> {
  const url = BACKEND_DOMAIN + ROUTES.backend.samfundet__feedback;
  const response = await axios.post(url, feedbackData, { withCredentials: true });

  return response;
}

export async function postRejectionMail(recruitmentId: string, rejectionMail: MailDto): Promise<AxiosResponse> {
  const url =
    BACKEND_DOMAIN +
    reverse({
      pattern: ROUTES.backend.samfundet__rejected_applicants,
      queryParams: {
        recruitment: recruitmentId,
      },
    });
  const response = await axios.post(url, rejectionMail, { withCredentials: true });

  return response;
}
