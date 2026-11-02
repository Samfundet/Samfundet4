import { z } from 'zod';
import { KEY } from '~/i18n/constants';

export const MENU_ITEM_NAME = z.string().min(1, KEY.common_required);

export const MENU_ITEM_DESCRIPTION = z.string();

export const MENU_ITEM_PRICE = z.number().min(0);

export const FOOD_CATEGORY = z.number();

export const FOOD_PREFERENCES = z.array(z.number());
