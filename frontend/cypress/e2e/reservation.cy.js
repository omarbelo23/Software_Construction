describe('Table Reservation', () => {
  let userToken;
  let userInfo;

  before(() => {
    // Create a user and login to get token before tests
    const timestamp = new Date().getTime();
    const user = {
      name: `Reservation User ${timestamp}`,
      email: `resuser${timestamp}@example.com`,
      password: 'password123'
    };

    cy.request('POST', 'http://localhost:4000/api/auth/signup', user);
    cy.request('POST', 'http://localhost:4000/api/auth/login', {
      email: user.email,
      password: user.password
    }).then((response) => {
      userToken = response.body.token;
      userInfo = JSON.stringify(response.body.user);
      // Set token in local storage to simulate login
      window.localStorage.setItem('token', userToken);
      window.localStorage.setItem('user', userInfo);
    });
  });

  beforeEach(() => {
    // Restore local storage before each test
    cy.window().then((win) => {
      win.localStorage.setItem('token', userToken);
      win.localStorage.setItem('user', userInfo);
    });
  });

  it('should create a table reservation successfully', () => {
    // 1. Visit the Reservation page
    cy.visit('/reserve');

    // 2. Select a date (tomorrow)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateString = tomorrow.toISOString().split('T')[0];
    cy.get('input[id="date"]').type(dateString);

    // 3. Wait for time slots to load/update (if async) and select a time
    // The time selection is now a grid of buttons based on previous context, 
    // but the provided file content shows it might still be using buttons or inputs.
    // Based on ReservationPage.jsx provided:
    // It generates time slots. We need to click one.
    // Assuming the time slots are rendered as buttons or clickable elements.
    // If they are buttons with text like "10:00 AM":
    cy.contains('button', '10:00 AM').click();

    // 4. Submit the reservation
    cy.get('form').submit();

    // 5. Verify success
    cy.on('window:alert', (str) => {
      expect(str).to.equal('Reservation created successfully!');
    });

    // 6. Should redirect to home/dashboard
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });
});
