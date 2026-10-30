import type { BaseModelDto, OrganizationDto } from '~/dto';
import type { GangDto } from '../gangs/types';
import type { GangSectionDto } from '../gangsection/types';
import type { Slug } from '../types';

export type InformationPageDto = BaseModelDto & {
  // Only admin endpoints include id
  id?: number;
  slug_field: Slug;

  title_nb?: string;
  text_nb?: string;

  title_en?: string;
  text_en?: string;

  visible?: boolean;

  // `section` is only set when the page is owned by a section
  section?: GangSectionDto | null;
  gang?: GangDto | null;
  organization?: OrganizationDto | null;
};

export type EditInformationPageDto = {
  slug_field: Slug;
  title_nb: string;
  text_nb: string;
  title_en: string;
  text_en: string;
  visible: boolean;

  // Exactly one of these is set, never both
  gang_id?: number;
  section_id?: number;
};

export type InformationPageRevisionDto = {
  version: number;
  title_nb?: string | null;
  title_en?: string | null;
  created_at: string;
  created_by?: string | null;
};

export type InformationPageRevisionDetailDto = InformationPageRevisionDto & {
  text_nb?: string | null;
  text_en?: string | null;
};

export type InformationPageOwnerOptionDto = {
  gang: GangDto;
  section: GangSectionDto | null;
  organization: OrganizationDto | null;
  can_create: boolean;
  can_change: boolean;
  can_delete: boolean;
};
