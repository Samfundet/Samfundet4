import type { AppletCategory } from '~/Components/AdminBox/types';
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
        title_nb: 'Informasjonssider',
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
        title_nb: 'Brukere',
        title_en: 'Users',
        perm: PERM.SAMFUNDET_VIEW_USER,
        icon: 'mdi:person-search',
        url: ROUTES.frontend.admin_users,
      },
      {
        title_nb: 'Roller',
        title_en: 'Roles',
        perm: PERM.SAMFUNDET_VIEW_ROLE,
        icon: 'ph:user-circle-gear',
        url: ROUTES.frontend.admin_roles,
      },
      {
        title_nb: 'Gjenger',
        title_en: 'Gangs',
        perm: PERM.SAMFUNDET_ADD_GANG,
        icon: 'mdi:people-group',
        url: ROUTES.frontend.admin_gangs,
      },
      {
        title_nb: 'Opptak',
        title_en: 'Recruitment',
        perm: PERM.SAMFUNDET_ADD_RECRUITMENT,
        icon: 'mdi:briefcase-search',
        url: ROUTES.frontend.admin_recruitment,
      },
      {
        title_nb: 'Lyche Reservasjon',
        title_en: 'Lyche Reservation',
        perm: PERM.SAMFUNDET_VIEW_RESERVATION,
        icon: 'mdi:food-outline',
        url: ROUTES.frontend.admin_sulten_reservations,
      },
      {
        title_nb: 'Lyche Meny',
        title_en: 'Lyche Menu',
        perm: PERM.SAMFUNDET_VIEW_MENU,
        icon: 'bx:food-menu',
        url: ROUTES.frontend.admin_sulten_menu,
      },
    ],
  },
];
