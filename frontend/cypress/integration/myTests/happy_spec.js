/* eslint-disable */
describe('happy path test', () => {
  beforeEach(() => {
    cy.exec('cd ../ && npm run reset && npm restart && npm run reset');
    cy.visit('localhost:3000');
    // waiting for backend to setup
    cy.wait(5000)
  });

  it('Registers sucessfully', () => {
    const name = 'Joe';
    const email = 'Joe@mail';
    const password = 'Joepassword';

    cy.get('button[name=registerButton]')
      .click();

    cy.get('input[name=registerEmail]')
      .focus()
      .type(email);

    cy.get('input[name=registerPassword]')
      .focus()
      .type(password);

    cy.get('input[name=registerName]')
      .focus()
      .type(name);

    cy.get('button[type=submit]')
      .click();
    
    cy.url().should('include', '/dashboard')

    cy.get('button[id=create-game-button]')
      .click();

    cy.get('input[id=game-name]')
    .focus()
    .type("New Game");

    cy.get('button[id=add-game-button]')
      .click();
    
    cy.get('button[id=start-game-button]')
    .click();
    
    cy.get('button[id=stop-game-button]')
    .click();

    cy.get('button[id=view-results-button]')
    .click();

    cy.url().should('include', '/admin-game-results')

    cy.wait(3000)

    cy.get('button[id=logout-button]')
    .click();

    cy.url().should('include', '/')

    cy.get('input[id=email-input]')
      .focus()
      .type(email);

    cy.get('input[id=password-input]')
      .focus()
      .type(password);

    cy.get('button[type=submit]')
    .click();

    cy.url().should('include', '/dashboard')

  });
});

