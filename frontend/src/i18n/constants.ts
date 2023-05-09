/**
 * Mapping of every existing translation key.
 *
 * All generic translations are prefixed with 'common_*'.
 * They are suitable for reuse.
 *
 * Other translations are scoped to their component or page.
 * They are mostly used a single place, and not reusable.
 * (If a translation is used many places, convert it to 'common_*')
 *
 * Naming convention: <component/page/common>_<key>: '<component/page/common>_<key>'
 * This is because the right side strings MUST be unique.
 *
 */
export const KEY = {
  // ==================== //
  //        Common        //
  // ==================== //

  // Days:
  common_day_monday: 'common_day_monday',
  common_day_tuesday: 'common_day_tuesday',
  common_day_wednesday: 'common_day_wednesday',
  common_day_thursday: 'common_day_thursday',
  common_day_friday: 'common_day_friday',
  common_day_saturday: 'common_day_saturday',
  common_day_sunday: 'common_day_sunday',

  // Months:
  common_month_january: 'common_month_january',
  common_month_february: 'common_month_february',
  common_month_march: 'common_month_march',
  common_month_april: 'common_month_april',
  common_month_may: 'common_month_may',
  common_month_june: 'common_month_june',
  common_month_july: 'common_month_july',
  common_month_august: 'common_month_august',
  common_month_september: 'common_month_september',
  common_month_october: 'common_month_october',
  common_month_november: 'common_month_november',
  common_month_december: 'common_month_december',

  // Date related
  common_today: 'common_today',
  common_tomorrow: 'common_tomorrow',

  // No category:
  common_to: 'common_to',
  common_buy: 'common_buy',
  common_name: 'common_name',
  common_save: 'common_save',
  common_from: 'common_from',
  common_date: 'common_date',
  common_show: 'common_show',
  common_menu: 'common_menu',
  common_edit: 'common_edit',
  common_tags: 'common_tags',
  common_gang: 'common_gang',
  common_next: 'common_next',
  common_event: 'common_event',
  common_events: 'common_events',
  common_login: 'common_login',
  common_register: 'common_register',
  common_firstname: 'common_firstname',
  common_lastname: 'common_lastname',
  common_repeat: 'common_repeat',
  common_image: 'common_image',
  common_title: 'common_title',
  common_venue: 'common_venue',
  common_venues: 'common_venues',
  common_sulten: 'common_sulten',
  common_logout: 'common_logout',
  common_create: 'common_create',
  common_search: 'common_search',
  common_choose: 'common_choose',
  common_missing: 'common_missing',
  common_delete: 'common_delete',
  common_message: 'common_message',
  common_english: 'common_english',
  common_whatsup: 'common_whatsup',
  common_contact: 'common_contact',
  common_password: 'common_password',
  common_about_us: 'common_about_us',
  common_previous: 'common_previous',
  common_required: 'common_required',
  common_volunteer: 'common_volunteer',
  common_norwegian: 'common_norwegian',
  common_contact_us: 'common_contact_us',
  common_restaurant: 'common_restaurant',
  common_membership: 'common_membership',
  common_information: 'common_information',
  common_description: 'common_description',
  common_reservations: 'common_reservations',
  common_opening_hours: 'common_opening_hours',
  common_about_samfundet: 'common_about_samfundet',
  common_back_to_samfundet: 'common_back_to_samfundet',
  common_delete_successful: 'common_delete_successful',
  common_update_successful: 'common_update_successful',
  common_creation_successful: 'common_creation_successful',
  common_see_in_django_admin: 'common_see_in_django_admin',
  common_something_went_wrong: 'common_something_went_wrong',

  // Price groups
  common_ticket_type_billig: 'common_ticket_type_billig',
  common_ticket_type_free: 'common_ticket_type_free',
  common_ticket_type_included: 'common_ticket_type_included',
  common_ticket_type_custom: 'common_ticket_type_custom',
  common_ticket_type_registration: 'common_ticket_type_registration',
  common_ticket_type: 'common_ticket_type',

  // ==================== //
  //        Others        //
  // ==================== //

  // LoginPage:
  loginpage_internal_login: 'loginpage_internal_login',
  loginpage_email_placeholder: 'loginpage_email_placeholder',
  loginpage_forgotten_password: 'loginpage_forgotten_password',
  loginpage_register: 'loginpage_register',

  // GroupsPage:
  groupspage_gangs_text: 'groupspage_gangs_text',
  groupspage_gangs_title: 'groupspage_gangs_title',

  // Venue Page
  venuepage_title: 'venuepage_title',

  // Navbar
  navbar_photos: 'navbar_photos',
  navbar_nybygg: 'navbar_nybygg',
  navbar_map: 'navbar_map',

  // Sulten / Lyche:
  sulten_page_see_menu: 'sulten_page_see_menu',
  sulten_page_about_us: 'sulten_page_about_us',
  sulten_page_book_table: 'sulten_page_book_table',
  sulten_page_more_about_us: 'sulten_page_more_about_us',

  // Admin:
  admin_organizer: 'admin_organizer',
  admin_saksdokument: 'admin_saksdokument',
  admin_images_title: 'admin_images_title',
  admin_images_create: 'admin_images_create',
  adminpage_gangs_title: 'admin_gangs_title',
  adminpage_gangs_create: 'admin_gangs_create',
  admin_opening_hours_hint: 'admin_opening_hours_hint',
  admin_closed_period_title: 'admin_closed_period_title',
  admin_saksdokumenter_title: 'admin_saksdokumenter_title',
  admin_gangsadminpage_webpage: 'admin_gangsadminpage_webpage',
  admin_events_recently_edited: 'admin_events_recently_edited',
  admin_closed_period_new_period: 'admin_closed_period_new_period',
  admin_information_manage_title: 'admin_information_manage_title',
  admin_closed_period_edit_period: 'admin_closed_period_edit_period',
  admin_information_confirm_delete: 'admin_information_confirm_delete',
  admin_information_confirm_cancel: 'admin_information_confirm_cancel',
  admin_gangsadminpage_abbreviation: 'admin_gangsadminpage_abbreviation',
  admin_saksdokumenter_cannot_reupload: 'admin_saksdokumenter_cannot_reupload',

  // No category:
  owner: 'owner',
  end_time: 'end_time',
  category: 'category',
  event_type: 'event_type',
  start_time: 'start_time',
  last_updated: 'last_updated',
  form_confirm: 'form_confirm',
  control_panel_faq: 'control_panel_faq',
  control_panel_title: 'control_panel_title',
  information_page_short: 'information_page_short',
  inputfile_choose_a_file: 'inputfile_choose_a_file',
  inputfile_no_file_selected: 'inputfile_no_file_selected',
  notfoundpage_contact_prompt: 'notfoundpage_contact_prompt',
  saksdokumentpage_publication_date: 'saksdokumentpage_publication_date',
  eventsadminpage_successful_delete_toast: 'eventsadminpage_successful_delete_toast',
} as const;

/**
 * Types used for type-proofing translations
 * Reveals errors in translations.ts if some keys are not translated
 */
export type KeyKeys = keyof typeof KEY;
export type KeyValues = typeof KEY[KeyKeys];

export const LANGUAGES = {
  NB: 'nb',
  EN: 'en',
} as const;

export type LanguageKey = keyof typeof LANGUAGES;
export type LanguageValue = typeof LANGUAGES[LanguageKey];
