
  it('Login success', () => {
    cy.intercept('api/v1/dispatchers/me?').as('me');

    cy.login();

    cy.wait('@me').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
      expect(response.body.name).to.equal('Test User');
    });
   
  });

  it('Open Trucks page', () => {
    cy.intercept('api/v1/trucks?*').as('trucks');

    cy.login();

    cy.contains('Fleet').click();
    cy.contains('Trucks').click();
    
    cy.get('.page-header').contains('Trucks');  
    cy.get('form .v-row .v-row').should('be.visible');
    cy.get('table').should('be.visible');
    cy.wait('@trucks').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });

  });

  it('Check table data', () => {
    cy.viewport(1800,1000);
    cy.intercept('api/v1/trucks?*').as('trucks');

    cy.login();

    cy.visit('/fleets/trucks');

    cy.wait('@trucks').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
      for (let i = 0; i < response.body.items.length; i++) {
        let trailer = response.body.items[i].trailer;
        if (trailer !== null) {
          cy.get('tbody').find('tr').eq(i)
            .find('td').eq(3)
            .find('div').first()
            .should("include.text", `${trailer.length}`);    
        }
      }
    });
  });

    it('Verify filter works', () => {
      cy.intercept('api/v1/trucks?*').as('trucks');
      cy.viewport(1800,1000);
      cy.login();

      cy.visit('/fleets/trucks');
      cy.wait('@trucks');
      cy.get('.v-col-md-4').click();
      cy.get('.v-list-item-title').contains('Sprinter Van').click();
      cy.get('#search--apply-btn').click();

      cy.wait('@trucks').then(({ response }) => {
        cy.get('tbody').find('tr').then(elements => {
          for (let i = 0; i < elements.length; i++) {
            cy.get('tbody').find('tr').eq(i)
              .find('td').eq(0)
              .find('.text-grey-darken-2')
              .should("include.text", 'Sprinter Van');
          }
        });
      });
    });
