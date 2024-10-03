import { z } from 'zod';

export const WEBSITE_URL = z
  .string()
  .regex(/^(https?:\/\/)?(www.)?[a-z0-9]+\.[a-z]+(\/[A-Za-z0-9-._~:/?#\[\]@!$&'()*+,;%=]+\/?)*\/?$/);
