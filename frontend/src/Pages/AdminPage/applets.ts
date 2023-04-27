import { AppletCategory } from '~/Components/AdminBox/types';
import { PERM } from '~/permissions';
import { ROUTES } from '~/routes';

export const appletCategories: AppletCategory[] = [
  {
    title_en: 'General',
    title_nb: 'Generelt',
    applets: [
      {
        title_nb: 'Arrangementer',
        title_en: 'Events',
        perm: PERM.SAMFUNDET_ADD_EVENT,
        icon: 'material-symbols:calendar-month-outline-rounded',
        url: ROUTES.frontend.admin_events,
      },
      {
        title_nb: 'Informasjons­­sider',
        title_en: 'Information pages',
        perm: PERM.SAMFUNDET_ADD_INFORMATIONPAGE,
        icon: 'ph:note-pencil-light',
        url: ROUTES.frontend.admin_information,
      },
      {
        title_nb: 'Åpningstider',
        title_en: 'Open hours',
        perm: PERM.SAMFUNDET_CHANGE_VENUE,
        icon: 'mdi:clock-time-eight-outline',
        url: ROUTES.frontend.admin_opening_hours,
      },
      {
        title_nb: 'Stengte perioder',
        title_en: 'Closed periods',
        perm: PERM.SAMFUNDET_ADD_CLOSEDPERIOD,
        icon: 'solar:moon-sleep-bold',
        url: ROUTES.frontend.admin_closed,
      },
      {
        title_nb: 'Bildearkiv',
        title_en: 'Images',
        perm: PERM.SAMFUNDET_ADD_IMAGE,
        icon: 'clarity:image-gallery-line',
        url: ROUTES.frontend.admin_images,
      },
      {
        title_nb: 'Saksdokumenter',
        title_en: 'Documents',
        perm: PERM.SAMFUNDET_ADD_SAKSDOKUMENT,
        icon: 'mdi:file-document-outline',
        url: ROUTES.frontend.admin_saksdokumenter,
      },
      {
        title_nb: 'Gjenger',
        title_en: 'Gangs',
        perm: PERM.SAMFUNDET_ADD_GANG,
        icon: 'mdi:people-group',
        url: ROUTES.frontend.admin_gangs,
      },
    ],
  },
];
