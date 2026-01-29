/* Temporary links to Samfundet3 which can allow us to incrementally ship Samfundet4 */

const BASE_URL = 'https://www.samfundet.no';
const PHOTO = 'https://foto.samfundet.no';

// Informasjonssider
export const INFORMATION_PAGES = {
  informasjon_billetter: `${BASE_URL}/informasjon/billetter`,
};

// Saksdokumenter
export const CASE_DOCUMENTS = {
  saksdokumenter: `${BASE_URL}/saksdokumenter`,
};

export const ROUTES_SAMF_THREE = {
  information: {
    general: `${BASE_URL}/informasjon`,
    membership: `${BASE_URL}/informasjon/medlemskap`,
    openingHours: `${BASE_URL}/informasjon/aapningstider`,
    photos: `${PHOTO}`,
    renting: `${BASE_URL}/informasjon/leie-lokaler`,
  },
  venues: {
    restaurant: `${BASE_URL}/lyche`,
    bar: `${BASE_URL}/informasjon/bar`,
    scene: `${BASE_URL}/informasjon/scene`,
    club: `${BASE_URL}/informasjon/klubb`,
  },
  volunteer: `${BASE_URL}/opptak`,
};
// Samfundet3 innlogging
export const SAMF3_LOGIN_URL = {
  login: `${BASE_URL}/logg-inn`,
};

export const SAMF3_MEMBER_URL = {
  medlem: 'https://medlem.samfundet.no/',
};
