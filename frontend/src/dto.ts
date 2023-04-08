import { ThemeValue } from '~/constants';
import { EventAgeRestriction, EventStatus, EventTicketType, HomePageElementVariation } from './types';

export type UserDto = {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
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
  age_restriction: EventAgeRestriction;
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
  ticket_type: EventTicketType;

  // Custom tickets (only relevant for custom price group events)
  custom_tickets: EventCustomTicketDto[];

  // Write only:
  // Used to create new event with using id of existing imagedto
  image?: ImageDto;
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
  id?: number;
  theme: ThemeValue;
  mirror_dimension: boolean;
};

export type InformationPageDto = {
  slug_field: string;

  title_nb?: string;
  text_nb?: string;

  title_en?: string;
  text_en?: string;
};

export type TableDto = {
  name_nb?: string;
  description_nb?: string;

  name_en?: string;
  description_en?: string;

  seating?: number;
};

export type FoodPreferenceDto = {
  name_nb?: string;
  name_en?: string;
};

export type FoodCategoryDto = {
  name_nb?: string;
  name_en?: string;
  order?: number;
};

export type MenuItemDto = {
  name_nb?: string;
  description_nb?: string;

  name_en?: string;
  description_en?: string;

  price?: number;
  price_member?: number;

  order?: number;
  food_preferences?: FoodPreferenceDto[];
};

export type MenuDto = {
  name_nb?: string;
  description_nb?: string;

  name_en?: string;
  description_en?: string;

  menu_items?: MenuItemDto[];
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
