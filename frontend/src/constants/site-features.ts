import { appletCategories } from '~/PagesAdmin/AdminLayout/applets';
import { ROUTES_FRONTEND } from '~/routes/frontend';
import type { SiteFeature } from '~/types';

const SITE_FEATURES: Record<SiteFeature, boolean> = {
  events: true,
  images: true,
  openingHours: true,
  closedHours: true,
  users: true,
  roles: false,
  gangs: false,
  information: false,
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

export function firstEnabledAdminPath(): string {
  const all = appletCategories.flatMap((c) => c.applets);

  const first = all.find((a) => a.url && (!a.feature || isSiteFeatureEnabled(a.feature)));

  return first?.url ?? ROUTES_FRONTEND.not_found;
}
