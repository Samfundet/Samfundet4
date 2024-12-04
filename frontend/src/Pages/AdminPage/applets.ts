import type { AppletCategory } from '~/Components/AdminBox/types';
import { PERM } from '~/permissions';
import { ROUTES } from '~/routes';

export const appletCategories: AppletCategory[] = [
  {
    title_en: 'General',
    title_nb: 'Generelt',
    applets: [
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
    ],
  },
];
