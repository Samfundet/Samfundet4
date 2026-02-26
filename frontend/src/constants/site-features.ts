import type { SiteFeature } from '~/types';

const SITE_FEATURES: Record<SiteFeature, boolean> = {
  navigation: true,
  profile: true,
  changePassword: false,
  events: true,
  images: true,
  openingHours: true,
  closedHours: true,
  users: false,
  roles: false,
  gangs: false,
  information: false,
  documents: false,
  recruitment: false,
  sulten: false,
  faq: false,
  venues: false,
  membership: false,
};

export function isSiteFeatureEnabled(f: SiteFeature) {
  return SITE_FEATURES[f];
}
