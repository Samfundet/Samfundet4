import type { ControlPanelFeature } from '~/types';

const CONTROL_PANEL_FEATURES: Record<ControlPanelFeature, boolean> = {
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

export function isControlPanelFeatureEnabled(f?: ControlPanelFeature) {
  return !!f && CONTROL_PANEL_FEATURES[f];
}
