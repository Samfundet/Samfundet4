/* Temporary links to Samfundet3 which can allow us to incrementally ship Samfundet4 */

const BASE_URL = 'https://www.samfundet.no';
const INFORMATION = BASE_URL + '/informasjon';
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
    general: `${INFORMATION}`,
    membership: `${INFORMATION}/medlemskap`,
    openingHours: `${INFORMATION}/aapningstider`,
    photos: `${PHOTO}`,
    renting: `${INFORMATION}/leie-lokaler`,
  },
  venues: {
    restaurant: `${BASE_URL}/lyche`,
    bar: `${INFORMATION}/bar`,
    scene: `${INFORMATION}/scene`,
    club: `${INFORMATION}/klubb`,
  },
  volunteer: `${BASE_URL}/opptak`,
} as const;
