import { z } from 'zod';

// The reason we don't use zod's .url() is because it allows too much. Eg. it considers this valid: https:....google.com
//
// The regex is case-insensitive (`i` flag) because scheme and host names are case-insensitive,
// so eg. "https://Example.com" and "WWW.SAMFUNDET.NO" must be accepted.
//
// The host is one or more labels, each followed by a dot, and then a letters-only top-level domain.
// A label may contain hyphens, but may not start or end with one. This allows eg. "my-site.no" and
// "foo.samfundet.no". "www." is just an ordinary label, so it needs no special group.
export const WEBSITE_URL = z
  .string()
  .regex(/^(https?:\/\/)?([a-z0-9]([a-z0-9-]*[a-z0-9])?\.)+[a-z]+(\/[A-Za-z0-9-._~:/?#\[\]@!$&'()*+,;%=]+\/?)*\/?$/i);
