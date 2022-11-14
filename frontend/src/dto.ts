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
  groups: GroupDto[];
  user_permissions: PermissionDto[];
};

export type GroupDto = {
  id: number;
  name: string;
  permissions: PermissionDto[];
};

export type PermissionDto = {
  id: number;
  name: string;
  content_type: ContentTypeDto;
  codename: string;
};

export type ContentTypeDto = {
  id: number;
  app_label: string;
  model: string;
};

export type VenueDto = {
  id: number;
  name: string;
  description: string;
  floor: number;
  last_renovated: number;
  handicapped_approved: boolean;
  responsible_crew: string;
};

export type EventDto = {
  id: number;
  title_no: string;
  title_en: string;
  start_dt: Date;
  end_dt: Date;
  description_long_no: string;
  description_long_en: string;
  description_short_no: string;
  description_short_en: string;
  publish_dt: Date;
  host: string;
  location: string;
  event_group: EventGroupDto;
};

export type EventGroupDto = {
  id: number;
};
