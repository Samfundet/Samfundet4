import { ThemeValue } from '~/constants';

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
  id?: number;
  name?: string;
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

export type EventDto = {
  id: number;
  title_no: string;
  title_en: string;
  start_dt: Date;
  duration: number;
  end_dt?: Date;
  description_long_no: string;
  description_long_en: string;
  description_short_no: string;
  description_short_en: string;
  publish_dt: Date;
  host: string;
  location: string;
  event_group: EventGroupDto;
  price_group: string;
  status_group: string;
  age_group: string;
  codeword: string;
  banner_image: string;
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
  theme?: ThemeValue;
};

export type InformationPageDto = {
  slug_field?: string;

  title_no?: string;
  text_no?: string;

  title_en?: string;
  text_en?: string;
};

export type TableDto = {
  name_no?: string;
  description_no?: string;

  name_en?: string;
  description_en?: string;

  seating?: number;
};

export type FoodPreferenceDto = {
  name_no?: string;
  name_en?: string;
};

export type FoodCategoryDto = {
  name_no?: string;
  name_en?: string;
  order?: number;
};

export type MenuItemDto = {
  name_no?: string;
  description_no?: string;

  name_en?: string;
  description_en?: string;

  price?: number;
  price_member?: number;

  order?: number;
  food_preferences?: FoodPreferenceDto[];
};

export type MenuDto = {
  name_no?: string;
  description_no?: string;

  name_en?: string;
  description_en?: string;

  menu_items?: MenuItemDto[];
};

export type SaksdokumentDto = {
  title_no?: string;
  title_en?: string;
  category?: string;
  publication_date?: Date;
  file?: string;
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
  name_no: string;
  name_en: string;
  abbreviation: string;
  webpage?: string;
  logo?: string;
  gang_type?: number;
  info_page?: number;
};

export type GangTypeDto = {
  id: number;
  title_no: string;
  title_en: string;
  gangs: GangDto[];
};
