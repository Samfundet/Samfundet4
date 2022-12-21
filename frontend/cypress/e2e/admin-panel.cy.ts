import { BACKEND_DOMAIN } from '../../src/constants';
import { ROUTES } from '../../src/routes';

it('Log in to admin panel', () => {
  cy.visit(BACKEND_DOMAIN + ROUTES.backend.admin__index);

  cy.get('#id_username').type('cypress_superuser');
  cy.get('#id_password').type('Django123').type('{enter}');
});
