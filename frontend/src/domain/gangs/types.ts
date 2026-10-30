import type { OrganizationDto } from '~/dto';
import type { Slug } from '../types';

export type GangDto = {
  id: number;
  name_nb: string;
  name_en: string;
  abbreviation: string;
  webpage?: string;
  logo?: string;
  gang_type?: number | null;
  info_page?: Slug | null;
  organization?: number | null;
};

export type EditGangDto = {
  name_nb: string;
  name_en: string;
  abbreviation?: string;
  webpage?: string;
  logo?: File;
  organization?: number;
  gang_type?: number | null;
  info_page?: Slug | null;
};

export type GangTypeDto = {
  id: number;
  title_nb: string;
  title_en: string;
  gangs: GangDto[];
};

export type AdminGangTypeDto = {
  id: number;
  title_nb: string;
  title_en: string;
};

export type AdminGangListGangDto = Omit<GangDto, 'gang_type'> & {
  gang_type: GangTypeDto | null;
};

export type AdminGangListOrganizationDto = OrganizationDto & {
  gangs: AdminGangListGangDto[];
};
