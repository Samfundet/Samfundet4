import { z } from 'zod';
import { IMAGE_FILE } from '../schema';

export const GANG_SECTION_NAME = z.string();

export const GANG_SECTION_LOGO_FILE = IMAGE_FILE;
