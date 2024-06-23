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

  // Day abbreviations:
  common_day_monday_short: 'common_day_monday_short',
  common_day_tuesday_short: 'common_day_tuesday_short',
  common_day_wednesday_short: 'common_day_wednesday_short',
  common_day_thursday_short: 'common_day_thursday_short',
  common_day_friday_short: 'common_day_friday_short',
  common_day_saturday_short: 'common_day_saturday_short',
  common_day_sunday_short: 'common_day_sunday_short',

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

  // Date related:
  common_today: 'common_today',
  common_tomorrow: 'common_tomorrow',

  // No category:
  common_to: 'common_to',
  common_price: 'common_price',
  common_food: 'common_food',
  common_preferences: 'common_preferences',
  common_buy: 'common_buy',
  common_not: 'common_not',
  common_time: 'common_time',
  common_here: 'common_here',
  common_name: 'common_name',
  common_save: 'common_save',
  common_from: 'common_from',
  common_date: 'common_date',
  common_show: 'common_show',
  common_menu: 'common_menu',
  common_table: 'common_table',
  common_max: 'common_max',
  common_edit: 'common_edit',
  common_card: 'common_card',
  common_tags: 'common_tags',
  common_gang: 'common_gang',
  common_next: 'common_next',
  common_open: 'common_open',
  common_send: 'common_send',
  common_gangs: 'common_gangs',
  common_event: 'common_event',
  common_login: 'common_login',
  common_image: 'common_image',
  common_title: 'common_title',
  common_venue: 'common_venue',
  common_cancel: 'common_cancel',
  common_events: 'common_events',
  common_repeat: 'common_repeat',
  common_venues: 'common_venues',
  common_sulten: 'common_sulten',
  common_logout: 'common_logout',
  common_go_back: 'common_go_back',
  common_create: 'common_create',
  common_search: 'common_search',
  common_choose: 'common_choose',
  common_loading: 'common_loading',
  common_missing: 'common_missing',
  common_delete: 'common_delete',
  common_profile: 'common_profile',
  common_message: 'common_message',
  common_english: 'common_english',
  common_whatsup: 'common_whatsup',
  common_contact: 'common_contact',
  common_unknown: 'common_unknown',
  common_sponsor: 'common_sponsors',
  common_username: 'common_username',
  common_lastname: 'common_lastname',
  common_register: 'common_register',
  common_email: 'common_email',
  common_total: 'common_total',
  common_guests: 'common_guests',
  common_occasion: 'common_occasion',
  common_phonenumber: 'common_phonenumber',
  common_password: 'common_password',
  common_about_us: 'common_about_us',
  common_overview: 'common_overview',
  common_recruitmentposition: 'common_recruitmentposition',
  common_not_set: 'common_not_set',
  common_campus: 'common_campus',
  common_previous: 'common_previous',
  common_required: 'common_required',
  common_not_required: 'common_not_required',
  common_festivals: 'common_festivals',
  common_more_info: 'common_more_info',
  common_firstname: 'common_firstname',
  common_volunteer: 'common_volunteer',
  common_norwegian: 'common_norwegian',
  common_contact_us: 'common_contact_us',
  common_restaurant: 'common_restaurant',
  common_member: 'common_member',
  common_membership: 'common_membership',
  common_select_all: 'common_select_all',
  common_information: 'common_information',
  common_description: 'common_description',
  common_recruitment: 'common_recruitment',
  common_reservation: 'common_reservation',
  common_unselect_all: 'common_unselect_all',
  common_opening_hours: 'common_opening_hours',
  common_general: 'common_general',
  common_long_description: 'common_long_description',
  common_short_description: 'common_short_description',
  common_back_to_samfundet: 'common_back_to_samfundet',
  common_save_successful: 'common_save_successful',
  common_delete_successful: 'common_delete_successful',
  common_update_successful: 'common_update_successful',
  common_creation_successful: 'common_creation_successful',
  common_see_in_django_admin: 'common_see_in_django_admin',
  common_something_went_wrong: 'common_something_went_wrong',
  common_click_here: 'common_click_here',

  //About page
  common_age_limit: 'common_age_limit',
  common_rent_services: 'common_rent_services',
  common_press: 'common_press',
  common_film_club: 'common_film_club',
  common_privacy_policy: 'common_privacy_policy',
  common_facilitation: 'common_facilitation',
  common_the_groups_at_samfundet: 'commong_the_groups_at_samfundet',
  common_volunteering: 'common_volunteering',
  common_overview_map: 'common_overview_map',
  common_new_building: 'common_new_building',
  common_documents: 'common_documents',
  common_our_history: 'common_our_history',
  common_about_the_organisation: 'common_about_the_organisation',
  common_the_society_meeting: 'common_the_society_meeting',
  common_tickets: 'common_tickets',
  common_contact_information: 'common_contact_information',
  common_about_samfundet: 'common_about_samfundet',

  // Price groups:
  common_ticket_type: 'common_ticket_type',
  common_ticket_type_free: 'common_ticket_type_free',
  common_ticket_type_custom: 'common_ticket_type_custom',
  common_ticket_type_billig: 'common_ticket_type_billig',
  common_ticket_type_included: 'common_ticket_type_included',
  common_ticket_type_registration: 'common_ticket_type_registration',

  // ==================== //
  //        Others        //
  // ==================== //

  // LoginPage:
  loginpage_register: 'loginpage_register',
  loginpage_internal_login: 'loginpage_internal_login',
  loginpage_username: 'loginpage_username',
  loginpage_forgotten_password: 'loginpage_forgotten_password',
  loginpage_passwords_must_match: 'loginpage_passwords_must_match',
  loginpage_login_failed: 'loginpage_login_failed',

  // GroupsPage:
  groupspage_gangs_text: 'groupspage_gangs_text',
  groupspage_gangs_title: 'groupspage_gangs_title',

  // EventPageAge:
  eighteen: 'eighteen',
  twenty: 'twenty',
  none: 'none',
  mix: 'mix',

  // Venue Page:
  venuepage_title: 'venuepage_title',

  // InformationPage
  information_page: 'information_page',
  information_page_short: 'information_page_short',

  // Navbar:
  navbar_map: 'navbar_map',
  navbar_photos: 'navbar_photos',
  navbar_nybygg: 'navbar_nybygg',

  // Sulten / Lyche:
  sulten_dishes: 'sulten_dishes',
  sulten_lyche_goal: 'sulten_lyche_goal',
  sulten_what_is_lyche: 'sulten_what_is_lyche',
  sulten_page_see_menu: 'sulten_page_see_menu',
  sulten_page_about_us: 'sulten_page_about_us',
  sulten_page_book_table: 'sulten_page_book_table',
  sulten_lyche_about_menu: 'sulten_lyche_about_menu',
  sulten_page_more_about_us: 'sulten_page_more_about_us',
  sulten_reservation_form_occasion_help: 'sulten_reservation_form_occasion_help',
  sulten_reservation_form_more_than_8_help: 'sulten_reservation_form_more_than_8_help',
  sulten_reservation_form_remember_closing: 'sulten_reservation_form_remember_closing',
  sulten_reservation_form_find_times: 'sulten_reservation_form_find_times',

  // Recruitment:
  recruitment_tags: 'recruitment_tags',
  recruitment_position: 'recruitment_position',
  recruitment_applicant: 'recruitment_applicant',
  recruitment_applicants: 'recruitment_applicants',
  recruitment_interview_time: 'recruitment_interview_time',
  recruitment_interview_location: 'recruitment_interview_location',
  recruitment_interview_notes: 'recruitment_interview_notes',
  recruitment_priority: 'recruitment_priority',
  recruitment_recruiter_priority: 'recruitment_recruiter_priority',
  recruitment_recruiter_status: 'recruitment_recruiter_status',
  recruitment_duration: 'recruitment_duration',
  recruitment_admission: 'recruitment_admission',
  recruitment_funksjonaer: 'recruitment_funksjonaer',
  recruitment_gangmember: 'recruitment_gangmember',
  recruitment_organization: 'recruitment_organization',
  recruitment_applyfor: 'recruitment_applyfor',
  recruitment_applyforhelp: 'recruitment_applyforhelp',
  recruitment_volunteerfor: 'recruitment_volunteerfor',
  recruitment_otherpositions: 'KEY.recruitment_otherpositions',
  recruitment_visible_from: 'recruitment_visible_from',
  recruitment_administrate: 'recruitment_administrate',
  recruitment_my_applications: 'recruitment_my_applications',
  recruitment_all_applications: 'recruitment_all_applications',
  recruitment_not_applied: 'recruitment_not_applied',
  recruitment_will_be_anonymized: 'recruitment_will_be_anonymized',
  shown_application_deadline: 'shown_application_deadline',
  actual_application_deadlin: 'actual_application_deadline',
  recruitment_number_of_applications: 'recruitment_number_of_applications',
  recrutment_default_admission_letter: 'recrutment_default_admission_letter',
  reprioritization_deadline_for_groups: 'reprioritization_deadline_for_groups',
  max_admissions: 'max_admissions',
  recruitment_norwegian_applicants_only: 'recruitment_norwegian_applicants_only',
  reprioritization_deadline_for_applicant: 'reprioritization_deadline_for_applicant',
  recruitment_show_unprocessed_applicants: 'recruitment_show_unprocessed_applicants',
  recruitment_show_applicants_without_interview: 'recruitment_show_applicants_without_interview',
  recruitment_withdrawn_admissions: 'recruitment_withdrawn_admissions',
  recruitment_rejected_admissions: 'recruitment_rejected_admissions',
  recruitment_accepted_admissions: 'recruitment_accepted_admissions',
  recruitment_rejected_admissions_help_text: 'recruitment_rejected_admissions_help_text',
  recruitment_accepted_admissions_help_text: 'recruitment_accepted_admissions_help_text',
  recruitment_accepted_admissions_empty_text: 'recruitment_accepted_admissions_empty_text',
  recruitment_rejected_admissions_empty_text: 'recruitment_rejected_admissions_empty_text ',
  recruitment_withdrawn_admissions_empty_text: 'recruitment_withdrawn_admissions_empty_text',
  recruitment_withdrawn: 'recruitment_withdrawn',
  recruitment_withdraw_admission: 'KEY.recruitment_withdraw_admission',
  recruitment_withdrawn_message: 'recruitment_withdrawn_message',
  // Admin:
  admin_organizer: 'admin_organizer',
  admin_saksdokument: 'admin_saksdokument',
  admin_images_title: 'admin_images_title',
  admin_images_create: 'admin_images_create',
  admin_steal_identity: 'admin_steal_identity',
  adminpage_gangs_title: 'admin_gangs_title',
  adminpage_gangs_create: 'admin_gangs_create',
  admin_opening_hours_hint: 'admin_opening_hours_hint',
  admin_closed_period_title: 'admin_closed_period_title',
  admin_saksdokumenter_title: 'admin_saksdokumenter_title',
  admin_sultenmenu_title: 'admin_sultenmenu_title',
  admin_gangsadminpage_webpage: 'admin_gangsadminpage_webpage',
  admin_events_recently_edited: 'admin_events_recently_edited',
  admin_closed_period_new_period: 'admin_closed_period_new_period',
  admin_information_manage_title: 'admin_information_manage_title',
  admin_closed_period_edit_period: 'admin_closed_period_edit_period',
  admin_information_confirm_delete: 'admin_information_confirm_delete',
  admin_information_confirm_cancel: 'admin_information_confirm_cancel',
  admin_gangsadminpage_abbreviation: 'admin_gangsadminpage_abbreviation',
  admin_saksdokumenter_cannot_reupload: 'admin_saksdokumenter_cannot_reupload',

  // CommandMenu:
  command_menu_label: 'command_menu_label',
  command_menu_no_results: 'command_menu_no_results',
  command_menu_shortcut_home: 'command_menu_shortcut_home',
  command_menu_group_actions: 'command_menu_group_actions',
  command_menu_shortcut_admin: 'command_menu_shortcut_admin',
  command_menu_shortcut_lyche: 'command_menu_shortcut_lyche',
  command_menu_shortcut_closed: 'command_menu_shortcut_closed',
  command_menu_group_shortcuts: 'command_menu_group_shortcuts',
  command_menu_shortcut_events: 'command_menu_shortcut_events',
  command_menu_shortcut_venues: 'command_menu_shortcut_venues',
  command_menu_input_placeholder: 'command_menu_input_placeholder',
  command_menu_action_change_theme: 'command_menu_action_change_theme',
  command_menu_shortcut_recruitment: 'command_menu_shortcut_recruitment',
  command_menu_shortcut_create_event: 'command_menu_shortcut_create_event',
  command_menu_shortcut_opening_hours: 'command_menu_shortcut_opening_hours',
  command_menu_shortcut_control_panel: 'command_menu_shortcut_control_panel',
  command_menu_shortcut_about_samfundet: 'command_menu_shortcut_about_samfundet',

  // Occupied Recruitment
  occupied_help_text: 'occupied_help_text',
  occupied_select_time_text: 'occupied_select_time_text',
  occupied_title: 'occupied_title',
  occupied_show: 'occupied_show',

  // Feedback
  feedback_type: 'feedback_type',
  feedback_type_heading: 'feedback_type_heading',
  feedback_your_feedback: 'feedback_your_feedback',
  feedback_thank_you_for_feedback: 'feedback_thank_you_for_feedback',

  // No category:
  owner: 'owner',
  end_time: 'end_time',
  category: 'category',
  event_type: 'event_type',
  start_time: 'start_time',
  last_updated: 'last_updated',
  form_confirm: 'form_confirm',
  we_use_cookies: 'we_use_cookies',
  control_panel_faq: 'control_panel_faq',
  invalid_phonenumber: 'invalid_phonenumber',
  control_panel_title: 'control_panel_title',
  inputfile_choose_a_file: 'inputfile_choose_a_file',
  inputfile_no_file_selected: 'inputfile_no_file_selected',
  notfoundpage_contact_prompt: 'notfoundpage_contact_prompt',
  saksdokumentpage_publication_date: 'saksdokumentpage_publication_date',
  eventsadminpage_successful_delete_toast: 'eventsadminpage_successful_delete_toast',
} as const;

/**
 * Types used for type-proofing translations.
 * Reveals errors in translations.ts if some keys are not translated.
 */
export type KeyKeys = keyof typeof KEY;
export type KeyValues = (typeof KEY)[KeyKeys];

export const LANGUAGES = {
  NB: 'nb',
  EN: 'en',
} as const;

export type LanguageKey = keyof typeof LANGUAGES;
export type LanguageValue = (typeof LANGUAGES)[LanguageKey];
