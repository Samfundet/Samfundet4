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
  sulten_reservation_help: 'sulten_reservation_help',
  sulten_reservation_contact: 'sulten_reservation_contact',
  sulten_lyche_goal_text: 'sulten_lyche_goal_text',
  sulten_lyche_about_menu_text: 'sulten_lyche_about_menu_text',
  sulten_contact_page_text: 'sulten_contact_page_text',
  sulten_reservation_policy: 'sulten_reservation_policy',
  sulten_menu_introduction_text_1: 'sulten_menu_introduction_text_1',
  sulten_menu_introduction_text_2: 'sulten_menu_introduction_text_2',
  sulten_menu_introduction_text_3: 'sulten_menu_introduction_text_3',

  //About page
  festivals: 'festivals',
  volunteering: 'volunteering',
  the_society_meeting: 'the_society_meeting',
  about_samfundet: 'about_samfundet',
  sulten_contact_page_title: 'sulten_contact_page_title',

  //Recruitment samf
  samf_recruitment_description: 'samf_recruitment_description',
  no_recruitment_samf_header: 'no_recruitment_samf_header',
  no_recruitment_samf_about: 'no_recruitment_samf_about',
  no_recruitment_samf_next: 'no_recruitment_samf_next',

  //Recruitment ISFIT
  isfit_recruitment_description: 'isfit_recruitment_description',
  no_recruitment_isfit_header: 'no_recruitment_isfit_header',
  no_recruitment_isfit_about: 'no_recruitment_isfit_about',
  no_recruitment_isfit_next: 'no_recruitment_isfit_next',

  //Recruitment UKA
  uka_recruitment_description: 'uka_recruitment_description',
  no_recruitment_uka_header: 'no_recruitment_uka_header',
  no_recruitment_uka_about: 'no_recruitment_uka_about',
  no_recruitment_uka_next: 'no_recruitment_uka_next',

  //Membership
  membership: 'membership',
  why_member_header: 'why_member_header',
  why_member_text: 'why_member_text',
  why_member_list_0: 'why_member_list_0',
  why_member_list_1: 'why_member_list_1',
  why_member_list_2: 'why_member_list_2',
  why_member_list_3: 'why_member_list_3',
  why_member_list_4: 'why_member_list_4',
  why_member_list_5: 'why_member_list_5',
  why_member_list_6: 'why_member_list_6',
  why_member_list_7: 'why_member_list_7',
  membership_prices_header: 'membership_prices_header',
  membership_prices_0: 'membership_prices_0',
  membership_prices_1: 'membership_prices_1',
  membership_prices_2: 'membership_prices_2',
  membership_prices_3: 'membership_prices_3',
  membership_prices_4: 'membership_prices_4',
  membership_prices_5: 'membership_prices_5',
  who_member_header: 'who_member_header',
  who_member_text: 'who_member_text',
  who_member_list_0: 'who_member_list_0',
  who_member_list_1: 'who_member_list_1',
  who_member_list_2: 'who_member_list_2',
  member_benefits: 'member_benefits',
  member_benefits_text: 'member_benefits_text',
  member_benefits_list_0: 'member_benefits_list_0',
  member_benefits_list_1: 'member_benefits_list_1',
  member_benefits_list_2: 'member_benefits_list_2',
  member_benefits_list_3: 'member_benefits_list_3',
  buy_membership: 'buy_membership',
  buy_membership_text_0: 'buy_membership_text_0',
  buy_membership_text_1: 'buy_membership_text_1',
  buy_membership_text_2: 'buy_membership_text_2',
  register_card: 'register_card',
  register_card_text: 'register_card_text',
  laws_and_statutes_header: 'laws_and_statutes_header',
  laws_and_statutes_text: 'laws_and_statutes_text',

  // Feedback
  feedback_helper_text: 'feedback_helper_text',
  feedback_want_contact_text: 'feedback_want_contact_text',
  // Purchase Feedback
  purchase_feedback_title: 'purchase_feedback_title',
  purchase_feedback_alternative_1: 'purchase_feedback_alternative_1',
  purchase_feedback_alternative_2: 'purchase_feedback_alternative_2',
  purchase_feedback_alternative_3: 'purchase_feedback_alternative_3',
  purchase_feedback_alternative_4: 'purchase_feedback_alternative_4',
  purchase_feedback_question_1: 'purchase_feedback_question_1',
  purchase_feedback_question_2: 'purchase_feedback_question_2',

  // Gangspage
  gangspage_text: 'gangspage_text',
} as const;

export type TextItemValue = (typeof TextItem)[keyof typeof TextItem];
