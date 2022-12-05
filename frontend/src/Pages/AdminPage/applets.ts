import { ROUTES } from '~/routes';
import { AUTH_ADD_GROUP } from '~/permissions';

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
    perm: AUTH_ADD_GROUP,
    options: [
      { text: 'Administrer gjenger', url: ROUTES.frontend.groups, type: 'ADD' },
      { text: 'Gjengene på huset', url: ROUTES.frontend.groups, type: 'MANAGE' },
    ],
  },
]
