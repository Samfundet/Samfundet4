import { ROUTES_OTHER } from '~/routes/other';
import { ROUTES_BACKEND } from './backend';
import { ROUTES_FRONTEND } from './frontend';
import { ROUTES_SAMF_THREE } from './samf-three';

export const ROUTES = {
  backend: ROUTES_BACKEND,
  frontend: ROUTES_FRONTEND,
  other: ROUTES_OTHER,
  samfThree: ROUTES_SAMF_THREE, // TODO: Remove when Samfundet4 is fully ready.
} as const;
