Cypress.Commands.add('fillPizzaForm', (options = {}) => {
  const defaults = {
    name: 'Test Kullanıcı',
    size: 'Orta',
    dough: 'Normal Hamur',
    toppingsCount: 4
  };
  
  const config = { ...defaults, ...options };
  
  cy.get('input[name="name"]').clear().type(config.name);
  cy.contains(config.size).click();
  cy.contains(config.dough).click();
  
  for (let i = 0; i < config.toppingsCount; i++) {
    cy.get('input[type="checkbox"]').eq(i).check({ force: true });
  }
});

Cypress.Commands.add('assertFormValidation', (errors = []) => {
  errors.forEach(errorMessage => {
    cy.contains(errorMessage).should('be.visible');
  });
});