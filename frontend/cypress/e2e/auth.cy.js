describe('User Registration & Login', () => {
  const timestamp = new Date().getTime();
  const user = {
    name: `Test User ${timestamp}`,
    email: `testuser${timestamp}@example.com`,
    password: 'password123'
  };

  it('should register a new user successfully', () => {
    // 1. Visit the Signup page
    cy.visit('/signup');

    // 2. Fill in the registration form
    cy.get('input[id="name"]').type(user.name);
    cy.get('input[id="email"]').type(user.email);
    cy.get('input[id="password"]').type(user.password);

    // 3. Submit the form
    cy.get('button[type="submit"]').click();

    // 4. Verify success alert and redirection
    cy.on('window:alert', (str) => {
      expect(str).to.equal('Signup successful! Please login with your credentials.');
    });
    
    // Should redirect to login page
    cy.url().should('include', '/login');
  });

  it('should login with the registered user', () => {
    // 1. Visit the Login page
    cy.visit('/login');

    // 2. Fill in the login form
    cy.get('input[id="email"]').type(user.email);
    cy.get('input[id="password"]').type(user.password);

    // 3. Submit the form
    cy.get('button[type="submit"]').click();

    // 4. Verify successful login and redirection to dashboard
    cy.url().should('eq', Cypress.config().baseUrl + '/');
    
    // 5. Verify user is logged in (e.g., check for logout button or user name)
    // Assuming there's a way to see user info or logout in the navbar
    cy.contains('Logout').should('exist');
  });
});
