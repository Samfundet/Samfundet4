import { KEY, KeyValues } from '~/i18n/constants';

export const BreadcrumbTitles: Record<string, KeyValues> = {
  // ==================== //
  //      Admin pages     //
  // ==================== //
  '/control-panel': KEY.command_menu_shortcut_control_panel,
  // Gangs:
  '/control-panel/gangs': KEY.adminpage_gangs_title,
  '/control-panel/gangs/create': KEY.adminpage_gangs_create,
  '/control-panel/gangs/edit': KEY.common_edit,
  // Events:
  '/control-panel/events': KEY.common_events,
  '/control-panel/events/edit': KEY.common_edit,
  '/control-panel/events/create': KEY.command_menu_shortcut_create_event,
  // Info pages:
  '/control-panel/information': KEY.admin_information_manage_title,
  //'/control-panel/information/edit/:slugField': ,
  '/control-panel/information/create': KEY.common_create,
  // Opening hours:
  '/control-panel/opening_hours': KEY.command_menu_shortcut_opening_hours,
  // Closed periods:
  '/control-panel/closed': KEY.command_menu_shortcut_closed,
  '/control-panel/closed/create': KEY.admin_closed_period_new_period,
  //'/control-panel/closed/edit/:id/',
  // Images:
  '/control-panel/images': KEY.admin_images_title,
  '/control-panel/images/create': KEY.admin_images_create,
  // Documents:
  '/control-panel/saksdokument': KEY.admin_saksdokumenter_title,
  '/control-panel/saksdokument/create': KEY.common_create,
  '/control-panel/saksdokument/edit': KEY.common_edit,
  // Recruitment:
  '/control-panel/recruitment': KEY.common_volunteer,
  '/control-panel/recruitment/edit': KEY.common_edit,
  '/control-panel/recruitment/create': KEY.common_create,
  // Lyche:
  '/control-panel/lyche-menu': KEY.admin_sultenmenu_title,
};
