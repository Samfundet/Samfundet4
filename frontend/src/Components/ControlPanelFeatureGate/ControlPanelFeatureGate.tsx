import { Navigate } from 'react-router-dom';
import { isControlPanelFeatureEnabled } from '~/config/controlPanelFeatures';
import { firstEnabledAdminPath } from '~/config/controlPanelRouting';
import type { ControlPanelFeature } from '~/types';

export function ControlPanelFeatureGate({
  feature,
  children,
}: {
  feature: ControlPanelFeature;
  children: JSX.Element;
}) {
  return isControlPanelFeatureEnabled(feature) ? children : <Navigate to={firstEnabledAdminPath()} replace />;
}
