import { ROUTES } from '~/routes';
import {
  SAMFUNDET_ADD_CLOSEDPERIOD,
  SAMFUNDET_ADD_EVENT,
  SAMFUNDET_ADD_GANG,
  SAMFUNDET_ADD_INFORMATIONPAGE,
} from '~/permissions';

export const applets = [
  {
    title: 'Tilgang',
    perm: null,
    options: [
      {
        text: 'Har du ikke tilgang til en tjeneste du burde hatt tilgang til? Spør gjenglederen din for å få tilgang.',
        url: '',
        type: 'INFO',
      },
      { text: '', url: '', type: 'KILROY' },
    ],
  },
  {
    title: 'Gjenger',
    perm: SAMFUNDET_ADD_GANG,
    options: [
      { text: 'Administrer gjenger', url: ROUTES.frontend.admin_gangs, type: 'ADD' },
      { text: 'Gjengene på huset', url: ROUTES.frontend.groups, type: 'MANAGE' },
    ],
  },
  {
    title: 'Informasjons­­sider',
    perm: SAMFUNDET_ADD_INFORMATIONPAGE,
    options: [
      { text: 'Ny side', url: ROUTES.frontend.admin_information_create, type: 'ADD' },
      { text: 'Administrer sider', url: ROUTES.frontend.admin_information, type: 'MANAGE' },
    ],
  },
  {
    title: 'Arrangementer',
    perm: SAMFUNDET_ADD_EVENT,
    options: [
      { text: 'Opprett arrangement', url: ROUTES.frontend.admin_events_create, type: 'ADD' },
      { text: 'Rediger arrangementer', url: ROUTES.frontend.admin_events_upcomming, type: 'MANAGE' },
      { text: 'Tidligere arrangementer', url: '', type: 'MANAGE' },
    ],
  },
  {
    title: 'Åpningstider',
    perm: SAMFUNDET_ADD_CLOSEDPERIOD,
    options: [{ text: 'Endre stengte perioder', url: ROUTES.frontend.admin_closed, type: 'EDIT' }],
  },
];
