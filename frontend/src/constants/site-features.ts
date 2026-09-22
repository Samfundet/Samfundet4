import type { SiteFeature } from '~/types';

const SITE_FEATURES: Record<SiteFeature, boolean> = {
  events: true,
  images: true,
  openingHours: true,
  closedHours: true,
  users: true,
  roles: false,
  gangs: true,
  information: true,
  infobox: true,
  documents: true,
  recruitment: false,
  sulten: false,
  faq: false,
  venues: false,
  membership: false,
};

export function isSiteFeatureEnabled(f: SiteFeature) {
  return SITE_FEATURES[f];
}
