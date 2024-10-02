import { z } from 'zod';

const contentTypes = ['', 'Organization', 'Gang', 'Section'] as const;

export const ROLE_CONTENT_TYPE = z.enum(contentTypes);
