import { z } from 'zod';

export const ROLE_NAME = z.string().min(1);

const contentTypes = ['', 'organization', 'gang', 'section'] as const;

export const ROLE_CONTENT_TYPE = z.enum(contentTypes);
