import { z } from 'zod';
import { LOCAL_DATETIME_REGEX } from '~/constants';

export const LOCAL_DATETIME = z.string().regex(LOCAL_DATETIME_REGEX, 'Invalid datetime');
