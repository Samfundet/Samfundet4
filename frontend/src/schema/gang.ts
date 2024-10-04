import { z } from 'zod';
import { INFO_PAGE_SLUG } from '~/schema/infopage';

export const NAME = z.string();

export const ABBREVIATION = z.string();

export const GANG_INFO_PAGE = INFO_PAGE_SLUG;

export const GANG_TYPE = z.number();
