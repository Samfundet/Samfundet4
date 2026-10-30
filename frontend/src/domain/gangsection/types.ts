import type { BaseModelDto } from '~/dto';
import type { GangDto } from '../gangs/types';

export type GangSectionDto = BaseModelDto & {
  id: number;
  name_nb: string;
  name_en: string;
  logo?: string;
  gang: GangDto;
};

export type EditGangSectionDto = {
  name_nb: string;
  name_en: string;
  logo?: File;
  gang: number;
};
