import { CYPRESS_BACKEND_DOMAIN } from '../../src/constants';
import { ROUTES } from '../../src/routes';

it('Fetching closed period', () => {
  cy.visit(CYPRESS_BACKEND_DOMAIN + ROUTES.backend.samfundet__isclosed);
});
