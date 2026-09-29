import { z } from 'zod';

// The reason we don't use zod's .url() is because it allows too much. Eg. it considers this valid: https:....google.com
//
// The regex is case-insensitive (`i` flag) because scheme and host names are case-insensitive,
// so eg. "https://Example.com" and "WWW.SAMFUNDET.NO" must be accepted.
export const WEBSITE_URL = z
  .string()
  .regex(/^(https?:\/\/)?(www.)?[a-z0-9]+\.[a-z]+(\/[A-Za-z0-9-._~:/?#\[\]@!$&'()*+,;%=]+\/?)*\/?$/i);
