import { KEY, KeyValues } from '~/i18n/constants';

export const nb: Record<KeyValues, string> = {
  [KEY.common_event]: 'Arrangement',
  [KEY.common_information]: 'Informasjon',
  [KEY.common_internal]: 'Intern',
  [KEY.common_member]: 'Medlem',
  [KEY.common_restaurant]: 'Restaurant',
  [KEY.common_volunteer]: 'Opptak',
  [KEY.common_other_language]: 'English',
  [KEY.common_buy]: 'Kjøp',
  [KEY.common_login]: 'Logg inn',
  [KEY.common_password]: 'passord',
  [KEY.login_forgotten_password]: 'Glemt passordet ditt?',
  [KEY.login_internal_login]: 'Logg inn som intern',
  [KEY.login_email_placeholder]: 'E-post eller medlemsnummer',
};

export const en: Record<KeyValues, string> = {
  [KEY.common_event]: 'Event',
  [KEY.common_information]: 'Information',
  [KEY.common_internal]: 'Internal',
  [KEY.common_member]: 'Member',
  [KEY.common_restaurant]: 'Restaurant',
  [KEY.common_volunteer]: 'Volunteer',
  [KEY.common_other_language]: 'Norsk',
  [KEY.common_buy]: 'Buy',
  [KEY.common_login]: 'Log in',
  [KEY.common_password]: 'password',
  [KEY.login_forgotten_password]: 'Forgot password?',
  [KEY.login_internal_login]: 'Log in as internal',
  [KEY.login_email_placeholder]: 'Email or membership ID',
};
