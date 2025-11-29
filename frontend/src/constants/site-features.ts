import type { SiteFeature } from '~/types';
import { appletCategories } from "~/Pages/AdminPage/applets";
import { ROUTES_FRONTEND } from "~/routes/frontend";

const SITE_FEATURES: Record<SiteFeature, boolean> = {
  profile: false,
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
};

export function isSiteFeatureEnabled(f: SiteFeature) {
  return SITE_FEATURES[f];
}

export function firstEnabledAdminPath(): string {
  const all = appletCategories.flatMap((c) => c.applets);

  const first = all.find((a) => a.url && (!a.feature || isSiteFeatureEnabled(a.feature)));

  return first?.url ?? ROUTES_FRONTEND.not_found;
}
