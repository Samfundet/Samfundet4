/**
 * Mapping of every existing text item key.
 *
 * referenced to as "TextItem.example"
 *
 * Naming convention: <component/page/common>_<key>: '<component/page/common>_<key>'
 * This is because the right side strings MUST be unique
 */

export const TextItem = {
  // Sulten
  sulten_reservation_text: 'sulten_reservation_text',
  sulten_menu_text: 'sulten_menu_text',
  sulten_about_us_text: 'sulten_about_us_text',
  sulten_contact_text: 'sulten_contact_text',
  sulten_about_page_text: 'sulten_about_page_text',
  sulten_what_is_lyche_text: 'sulten_what_is_lyche_text',
  sulten_lyche_goal_text: 'sulten_lyche_goal_text',
  sulten_lyche_about_menu_text: 'sulten_lyche_about_menu_text',
  sulten_contact_page_text: 'sulten_contact_page_text',

  //About page
  festivals: 'festivals',
  volunteering: 'volunteering',
  the_society_meeting: 'the_society_meeting',
  about_samfundet: 'about_samfundet',
} as const;
