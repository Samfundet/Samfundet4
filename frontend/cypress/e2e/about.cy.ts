import { ROUTES } from '../../src/routes';

describe('About page', () => {
  it('Opens about page', () => {
    cy.visit(ROUTES.frontend.about);
    // TODO: There will be several buttons on the about page that should be tested once functionality is added to them
  });
});
