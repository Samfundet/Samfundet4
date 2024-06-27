import { ThemeValue } from '~/constants';
import { EventAgeRestrictionValue, EventStatus, EventTicketTypeValue, HomePageElementVariation } from './types';

export type UserDto = {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  is_staff: boolean;
  is_active: boolean;
  is_superuser: boolean;
  date_joined: Date;
  last_login: Date;
  user_preference: UserPreferenceDto;
  profile: ProfileDto;
  groups: GroupDto[];
  permissions?: string[];
  object_permissions?: ObjectPermissionDto[];
};

export type CampusDto = {
  id: number;
  name_nb: string;
  name_en: string;
  abbreviation?: string;
};

export type RecruitmentAvailabilityDto = {
  start_date: string;
  end_date: string;
  timeslots: string[];
};

export type DateTimeslotDto = {
  [date: string]: string[];
};

export type OccupiedTimeslotDto = {
  recruitment: number;
  dates: DateTimeslotDto;
};

export type RecruitmentUserDto = {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  campus?: CampusDto;
  recruitment_application_ids?: string[];
  applications: RecruitmentApplicationDto[];
  applications_without_interview: RecruitmentApplicationDto[];
  top_application: RecruitmentApplicationDto;
};

export type HomePageDto = {
  // Array of events used for splash
  splash: EventDto[];
  // Home page elements (carousel, cards etc.)
  elements: HomePageElementDto[];
};

export type HomePageElementDto = {
  variation: HomePageElementVariation;
  title_nb: string;
  title_en: string;
  description_nb?: string;
  description_no?: string;
  events: EventDto[];
};

export type GroupDto = {
  id: number;
  name: string;
};

export type PermissionDto = {
  id: number;
  name: string;
  codename: string;
};

export type ObjectPermissionDto = {
  obj_pk: number;
  permission: string;
};

export type VenueDto = {
  id: number;
  slug: string;
  name: string;
  description?: string;
  floor?: number;
  last_renovated?: number;
  handicapped_approved?: boolean;
  responsible_crew?: string;
  opening?: string;
  closing?: string;
  opening_monday?: string;
  opening_tuesday?: string;
  opening_wednesday?: string;
  opening_thursday?: string;
  opening_friday?: string;
  opening_saturday?: string;
  opening_sunday?: string;

  closing_monday?: string;
  closing_tuesday?: string;
  closing_wednesday?: string;
  closing_thursday?: string;
  closing_friday?: string;
  closing_saturday?: string;
  closing_sunday?: string;
};

// ==================== //
//        Event         //
// ==================== //

// Custom ticket type
export type EventCustomTicketDto = {
  id: number;
  name_nb: string;
  name_en: string;
  price: number;
};

export type EventDto = {
  // Status of event
  status: EventStatus;

  // Used to group recurring events together
  event_group: EventGroupDto;

  // General info
  id: number;
  title_nb: string;
  title_en: string;
  description_long_nb: string;
  description_long_en: string;
  description_short_nb: string;
  description_short_en: string;
  age_restriction: EventAgeRestrictionValue;
  location: string;
  category: string;
  host: string;

  // Timestamps/duration
  image_url: string;
  start_dt: string;
  duration: number;
  end_dt: string;
  publish_dt: string;

  // Ticket type for event (billig, free, custom, registration etc.)
  ticket_type: EventTicketTypeValue;

  // Custom tickets (only relevant for custom price group events)
  custom_tickets: EventCustomTicketDto[];

  // Write only:
  // Used to create new event with using id of existing imagedto
  image?: ImageDto;
  capacity?: number;
};

export type EventGroupDto = {
  id: number;
  name: string;
};

export type ProfileDto = {
  id: number;
  nickname: string;
};

export type UserPreferenceDto = {
  id: number;
  theme: ThemeValue;
  mirror_dimension: boolean;
  cursor_trail: boolean;
};

export type InformationPageDto = {
  slug_field: string;

  title_nb?: string;
  text_nb?: string;

  title_en?: string;
  text_en?: string;
};

export type ReservationTableDto = {
  name: string;
  start_time: string;
  end_time: string;
};

export type TableDto = {
  id?: number;
  name_nb?: string;
  description_nb?: string;

  name_en?: string;
  description_en?: string;

  seating?: number;
  reservations?: ReservationTableDto[];
};

export type FoodPreferenceDto = {
  id: number;
  name_nb?: string;
  name_en?: string;
};

export type FoodCategoryDto = {
  id?: number;
  name_nb?: string;
  name_en?: string;
  order?: number;
};

export type MenuItemDto = {
  id?: number;
  name_nb?: string;
  description_nb?: string;

  name_en?: string;
  description_en?: string;

  price?: number;
  price_member?: number;

  order?: number;
  food_preferences?: FoodPreferenceDto[] | number[];
  food_category: FoodCategoryDto | number;
};

export type MenuDto = {
  name_nb?: string;
  description_nb?: string;

  name_en?: string;
  description_en?: string;

  menu_items?: MenuItemDto[];
};

export type ReservationDto = {
  name?: string;
  email?: string;
  phonenumber?: string;
  additional_info?: string;
  start_time: string;
  end_time?: string;
  // Needed for first part
  venue?: number;
  reservation_date?: string;
  guest_count?: number;
  occasion?: string;
  // Maybe ignore and use different dto?
  // internal_message?: string;
};

export type SaksdokumentDto = {
  id: number;
  title_nb: string;
  title_en: string;
  category: string;
  publication_date: string;
  file?: string; // For posting to backend
  url?: string; // Read only backend url
};

export type TextItemDto = {
  key: string;
  text_en: string;
  text_nb: string;
};

export type BookingDto = {
  name?: string;
  text?: string;

  tables?: TableDto[];
  user?: UserDto;

  from_dto?: Date;
  from_to?: Date;
};

export type OrganizationDto = {
  id: number;
  name: string;
};

export type GangDto = {
  id: number;
  name_nb: string;
  name_en: string;
  abbreviation: string;
  webpage?: string;
  logo?: string;
  gang_type?: number;
  info_page?: number;
};

export type GangTypeDto = {
  id: number;
  title_nb: string;
  title_en: string;
  gangs: GangDto[];
};

export type ClosedPeriodDto = {
  id: number;
  message_no: string;
  description_no: string;
  message_en: string;
  description_en: string;
  start_dt: Date;
  end_dt: Date;
};

export type TagDto = {
  id: number;
  name: string;
  color: string;
};

export type ImageDto = {
  id: number;
  title: string;
  url: string;
  tags: TagDto[];
};

export type ImagePostDto = ImageDto & {
  tag_string: string;
  file: File;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Tuple = [any, any];

export type KeyValueDto = {
  id: number;
  key: string;
  value: string;
};

export type NotificationDto = {
  id: number;
  slug: string;
  actor: string;
  verb: string;
  recipient: string;
  // TODO: There are more fields than this.
};

// ############################################################
//                       Recruitment
// ############################################################

export type RecruitmentDto = {
  id?: string;
  name_nb: string;
  name_en: string;
  visible_from: string;
  actual_application_deadline: string;
  shown_application_deadline: string;
  reprioritization_deadline_for_applicant: string;
  reprioritization_deadline_for_groups: string;
  max_applications?: number;
  organization: 'samfundet' | 'isfit' | 'uka';
  seperate_positions?: RecruitmentSeperatePositionDto[];
};

export type RecruitmentSeperatePositionDto = {
  name_nb: string;
  name_en: string;
  url: string;
};

export type UserPriorityDto = {
  direction: number;
};

export type RecruitmentPositionDto = {
  id: string;
  name_nb: string;
  name_en: string;

  short_description_nb: string;
  short_description_en: string;

  long_description_nb: string;
  long_description_en: string;

  is_funksjonaer_position: boolean;

  norwegian_applicants_only: boolean;

  default_application_letter_nb: string;
  default_application_letter_en: string;

  gang: GangDto;
  recruitment: string;

  tags: string;

  interviewers?: UserDto[];

  total_applicants?: number;
  processed_applicants?: number;
  accepted_applicants?: number;
};

export type InterviewDto = {
  id: number;
  interview_time: string;
  interview_location: string;
  room: string;
  notes: string;
  interviewers?: UserDto[];
};

export type RecruitmentApplicationDto = {
  id: string;
  interview?: InterviewDto;
  interview_time?: Date;
  application_text: string;
  recruitment_position: RecruitmentPositionDto;
  recruitment: number;
  user: UserDto;
  applicant_priority: number;
  recruiter_priority?: number | string;
  recruiter_status?: number;
  applicant_state?: number;
  created_at: string;
  withdrawn: boolean;
  application_count?: number;
};

export type RecruitmentApplicationRecruiterDto = {
  user: RecruitmentUserDto;
  application: RecruitmentApplicationDto;
  other_applications: RecruitmentApplicationDto[];
};

export type RecruitmentApplicationStateDto = {
  recruiter_priority?: number;
  recruiter_status?: number;
};

export type RecruitmentApplicationStateChoicesDto = {
  recruiter_priority: [number, string][];
  recruiter_status: [number, string][];
};

export type FeedbackDto = {
  text: string;
  screen_resolution: string;
  path: string;
  contact_email?: string;
};

export type SultenReservationDayDto = {
  date: Date;
  start_time: string;
  closing_time: string;
  tables: TableDto[];
};

export type RegistrationDto = {
  username: string;
  email: string;
  phone_number: string;
  firstname: string;
  lastname: string;
  password: string;
};
