import { ThemeValue } from '~/constants';
import { string } from 'prop-types';

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

export type EventOptionsDto = {
  name?: string;
  description?: string;
  renders?: object;
  actions: { POST: EventOptionsPostDto };
};

export type EventOptionsPostDto = {
  id?: EventOptionsPostKeysDto;
  end_dt?: EventOptionsPostKeysDto;
  image_url?: EventOptionsPostKeysDto;
  title_nb: EventOptionsPostKeysDto;
  title_en?: EventOptionsPostKeysDto;
  description_long_nb?: EventOptionsPostKeysDto;
  description_long_en?: EventOptionsPostKeysDto;
  description_short_nb?: EventOptionsPostKeysDto;
  description_short_en?: EventOptionsPostKeysDto;
  location?: EventOptionsPostKeysDto;
  codeword?: EventOptionsPostKeysDto;
  created_at?: EventOptionsPostKeysDto;
  updated_at?: EventOptionsPostKeysDto;
  start_dt?: EventOptionsPostKeysDto;
  duration?: EventOptionsPostKeysDto;
  publish_dt?: EventOptionsPostKeysDto;
  host?: EventOptionsPostKeysDto;
  status_group: EventOptionsPostKeysChoisesDto;
  age_group: EventOptionsPostKeysChoisesDto;
  category: EventOptionsPostKeysChoisesDto;
  price_group: EventOptionsPostKeysChoisesDto;
  capacity?: EventOptionsPostKeysDto;
  event_group?: EventOptionsPostKeysDto;
};

export type EventOptionsPostKeysDto = {
  actions?: object;
  type?: string;
  required?: boolean;
  read_only?: boolean;
  label: string;
};

export type EventOptionsPostKeysChoisesDto = {
  type: string;
  required: boolean;
  read_only: boolean;
  label: string;
  choices: EventOptionsChoises_Dto;
};

export type EventOptionsChoises_Dto = [
  {
    value: string;
    display_name: string;
  },
];

export type EventDto = {
  id: number;
  title_nb: string;
  title_en: string;
  start_dt: Date;
  duration: number;
  end_dt?: Date;
  description_long_nb: string;
  description_long_en: string;
  description_short_nb: string;
  description_short_en: string;
  publish_dt: Date;
  host: string;
  location: string;
  event_group: EventGroupDto;
  price_group: string;
  status_group: string;
  age_group: string;
  codeword: string;
  image_url?: string;
  category: string;
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
  id?: number;
  title_nb?: string;
  title_en?: string;
  category?: string;
  publication_date?: string;
  file?: string;
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
  image: string;
  tags: TagDto[];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Tuple = [any, any];

export type EventFormDto = {
  age_groups: Tuple[];
  status_groups: Tuple[];
  venues: Array<string[]>;
  event_groups: Tuple[];
};
