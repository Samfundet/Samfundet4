import { z } from 'zod';

// The reason we don't use zod's .url() is because it allows too much. Eg. it considers this valid: https:....google.com
export const WEBSITE_URL = z
  .string()
  .regex(/^(https?:\/\/)?(www.)?[a-z0-9]+\.[a-z]+(\/[A-Za-z0-9-._~:/?#\[\]@!$&'()*+,;%=]+\/?)*\/?$/);
