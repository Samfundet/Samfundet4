import {
  SAMFUNDET_ADD_CLOSEDPERIOD, SAMFUNDET_ADD_EVENT,
  SAMFUNDET_ADD_GANG,
  SAMFUNDET_ADD_IMAGE, SAMFUNDET_ADD_INFORMATIONPAGE, SAMFUNDET_ADD_SAKSDOKUMENT
} from '~/permissions';
import { ROUTES } from '~/routes';

export const applets = [
  {
    title: 'Tilgang',
    perm: null,
    icon: 'material-symbols:help-outline-sharp',
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
    icon: 'mdi:people-group',
    options: [
      { text: 'Administrer gjenger', url: ROUTES.frontend.admin_gangs, type: 'ADD' },
      { text: 'Gjengene på huset', url: ROUTES.frontend.groups, type: 'MANAGE' },
    ],
  },
  {
    title: 'Informasjons­­sider',
    perm: SAMFUNDET_ADD_INFORMATIONPAGE,
    icon: 'ph:note-pencil-light',
    options: [
      { text: 'Ny side', url: ROUTES.frontend.admin_information_create, type: 'ADD' },
      { text: 'Administrer sider', url: ROUTES.frontend.admin_information, type: 'MANAGE' },
    ],
  },
  {
    title: 'Arrangementer',
    perm: SAMFUNDET_ADD_EVENT,
    icon: 'material-symbols:calendar-month-outline-rounded',
    options: [
      { text: 'Opprett arrangement', url: ROUTES.frontend.admin_events_create, type: 'ADD' },
      { text: 'Rediger arrangementer', url: ROUTES.frontend.admin_events_upcomming, type: 'MANAGE' },
      { text: 'Tidligere arrangementer', url: '', type: 'MANAGE' },
    ],
  },
  {
    title: 'Åpningstider',
    perm: SAMFUNDET_ADD_CLOSEDPERIOD,
    icon: 'ic:outline-access-time',
    options: [{ text: 'Endre stengte perioder', url: ROUTES.frontend.admin_closed, type: 'EDIT' }],
  },
  {
    title: 'Bildearkiv',
    perm: SAMFUNDET_ADD_IMAGE,
    icon: 'clarity:image-gallery-line',
    options: [
      { text: 'Nytt Bilde', url: '', type: 'ADD' },
      { text: 'Gå til Bildearkiv', url: ROUTES.frontend.admin_images, type: 'MANAGE' },
    ],
  },
  {
    title: 'Saksdokumenter',
    perm: SAMFUNDET_ADD_SAKSDOKUMENT,
    icon: 'mdi:file-document-outline',
    options: [
      { text: 'Last opp nytt saksdokument', url: ROUTES.frontend.admin_saksdokument_create, type: 'ADD' },
      { text: 'Administrer saksdokument', url: ROUTES.frontend.admin_saksdokument, type: 'MANAGE' },
    ],
  },
];
