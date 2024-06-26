Cypress.Commands.add('login', () => {
    cy.visit('/login');
    cy.get('#input-0').type('test@gmail.com');
    cy.get('#input-2').type('12345678');
    cy.get('button').contains('Log in').click();
})