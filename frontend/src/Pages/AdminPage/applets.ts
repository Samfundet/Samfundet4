import { Applet, TYPE } from '~/Components/AdminBox/types';
import { PERM } from '~/permissions';
import { ROUTES } from '~/routes';

export const applets: Applet[] = [
  {
    title: 'Tilgang',
    perm: undefined,
    icon: 'material-symbols:help-outline-sharp',
    options: [
      {
        text: 'Har du ikke tilgang til en tjeneste du burde hatt tilgang til? Spør gjengsjefen din for å få tilgang.',
        url: '',
        type: TYPE.INFO,
      },
      { text: '', url: '', type: TYPE.KILROY },
    ],
  },
  {
    title: 'Gjenger',
    perm: PERM.SAMFUNDET_ADD_GANG,
    icon: 'mdi:people-group',
    options: [
      { text: 'Administrer gjenger', url: ROUTES.frontend.admin_gangs, type: TYPE.ADD },
      { text: 'Gjengene på huset', url: ROUTES.frontend.groups, type: TYPE.MANAGE },
    ],
  },
  {
    title: 'Informasjons­­sider',
    perm: PERM.SAMFUNDET_ADD_INFORMATIONPAGE,
    icon: 'ph:note-pencil-light',
    options: [
      { text: 'Ny side', url: ROUTES.frontend.admin_information_create, type: TYPE.ADD },
      { text: 'Administrer sider', url: ROUTES.frontend.admin_information, type: TYPE.MANAGE },
    ],
  },
  {
    title: 'Arrangementer',
    perm: PERM.SAMFUNDET_ADD_EVENT,
    icon: 'material-symbols:calendar-month-outline-rounded',
    options: [
      { text: 'Opprett arrangement', url: ROUTES.frontend.admin_events_create, type: TYPE.ADD },
      { text: 'Rediger arrangementer', url: ROUTES.frontend.admin_events_upcomming, type: TYPE.MANAGE },
      { text: 'Tidligere arrangementer', url: '', type: TYPE.MANAGE },
    ],
  },
  {
    title: 'Åpningstider',
    perm: PERM.SAMFUNDET_ADD_CLOSEDPERIOD,
    icon: 'ic:outline-access-time',
    options: [{ text: 'Endre stengte perioder', url: ROUTES.frontend.admin_closed, type: TYPE.EDIT }],
  },
  {
    title: 'Bildearkiv',
    perm: PERM.SAMFUNDET_ADD_IMAGE,
    icon: 'clarity:image-gallery-line',
    options: [
      { text: 'Nytt Bilde', url: ROUTES.frontend.admin_images_create, type: TYPE.ADD },
      { text: 'Gå til Bildearkiv', url: ROUTES.frontend.admin_images, type: TYPE.MANAGE },
    ],
  },
  {
    title: 'Saksdokumenter',
    perm: PERM.SAMFUNDET_ADD_SAKSDOKUMENT,
    icon: 'mdi:file-document-outline',
    options: [
      { text: 'Last opp nytt saksdokument', url: ROUTES.frontend.admin_saksdokumenter_create, type: TYPE.ADD },
      { text: 'Administrer saksdokumenter', url: ROUTES.frontend.admin_saksdokumenter, type: TYPE.MANAGE },
    ],
  },
];
