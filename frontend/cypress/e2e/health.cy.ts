import { ROUTES } from '../../src/routes';

describe('Health check', () => {
  it('Check rendered page', () => {
    cy.visit(ROUTES.frontend.health);
    cy.get('[data-cy=health]').should('exist');
  });
});
