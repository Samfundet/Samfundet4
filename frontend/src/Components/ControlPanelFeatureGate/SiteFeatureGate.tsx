import { Navigate } from 'react-router-dom';
import { isSiteFeatureEnabled, firstEnabledAdminPath } from '~/constants/site-features';
import type { SiteFeature } from '~/types';

export function SiteFeatureGate({
  feature,
  children,
}: {
  feature: SiteFeature;
  children: JSX.Element;
}) {
  return isSiteFeatureEnabled(feature) ? children : <Navigate to={firstEnabledAdminPath()} replace />;
}
