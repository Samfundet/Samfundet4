import { appletCategories } from '~/Pages/AdminPage/applets';
import { ROUTES_FRONTEND as R } from '~/routes/frontend';
import { isControlPanelFeatureEnabled } from './controlPanelFeatures';

export function firstEnabledAdminPath(): string {
  const all = appletCategories.flatMap((c) => c.applets);

  const first = all.find((a) => a.url && (!a.feature || isControlPanelFeatureEnabled(a.feature)));

  return first?.url ?? R.not_found;
}
