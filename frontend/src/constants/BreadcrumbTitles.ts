import { KEY, KeyValues } from '~/i18n/constants';

export const BREADCRUMB_TITLES: Record<string, KeyValues> = {
  // ==================== //
  //      Admin pages     //
  // ==================== //
  '/control-panel': KEY.command_menu_shortcut_control_panel,
  // Gangs:
  '/control-panel/gangs': KEY.adminpage_gangs_title,
  '/control-panel/gangs/create': KEY.adminpage_gangs_create,
  // Events:
  '/control-panel/events': KEY.common_events,
  '/control-panel/events/edit': KEY.common_edit, //ID
  '/control-panel/events/create': KEY.command_menu_shortcut_create_event,
  // Info pages:
  '/control-panel/information': KEY.adminpage_gangs_title,
  //'/control-panel/information/edit/:slugField': ,
  '/control-panel/information/create/': KEY.common_create, //Unødvendig forløpig
  // Opening hours:
  '/control-panel/opening_hours': KEY.command_menu_shortcut_opening_hours,
  // Closed periods:
  '/control-panel/closed/': KEY.command_menu_shortcut_closed,
  '/control-panel/closed/create/': KEY.admin_closed_period_new_period,
  //'/control-panel/closed/edit/:id/',
  // Images:
  '/control-panel/images/': KEY.admin_images_title,
  '/control-panel/images/create/': KEY.admin_images_create,
  // Documents:
  '/control-panel/saksdokument/': KEY.admin_saksdokumenter_title,
  '/control-panel/saksdokument/create/': KEY.common_create,
  //'/control-panel/saksdokument/edit/:id/'
};
