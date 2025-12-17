describe('Order Food', () => {
  let userToken;
  let userInfo;
  let reservationId;

  before(() => {
    // 1. Setup: Register, Login, and Create a Reservation
    const timestamp = new Date().getTime();
    const user = {
      name: `Food User ${timestamp}`,
      email: `fooduser${timestamp}@example.com`,
      password: 'password123'
    };

    // Signup & Login
    cy.request('POST', 'http://localhost:4000/api/auth/signup', user);
    cy.request('POST', 'http://localhost:4000/api/auth/login', {
      email: user.email,
      password: user.password
    }).then((loginRes) => {
      userToken = loginRes.body.token;
      userInfo = JSON.stringify(loginRes.body.user);
      
      // Create Reservation
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dateString = tomorrow.toISOString().split('T')[0];

      // Use a random time to avoid "fully booked" errors during repeated tests
      const hour = Math.floor(Math.random() * (20 - 12 + 1)) + 12; // 12 PM to 8 PM
      const minute = Math.random() < 0.5 ? '00' : '30';
      const timeString = `${hour}:${minute}`;
      
      cy.request({
        method: 'POST',
        url: 'http://localhost:4000/api/reservations',
        headers: { Authorization: `Bearer ${userToken}` },
        body: {
          date: dateString,
          time: timeString,
          partySize: 2
        },
        failOnStatusCode: false
      }).then((resRes) => {
        if (resRes.status === 200 || resRes.status === 201) {
            reservationId = resRes.body._id;
        } else {
             // If failed (e.g. full), try one more time with a different time
             const retryHour = hour === 20 ? 12 : hour + 1;
             cy.request({
                 method: 'POST',
                 url: 'http://localhost:4000/api/reservations',
                 headers: { Authorization: `Bearer ${userToken}` },
                 body: {
                   date: dateString,
                   time: `${retryHour}:00`,
                   partySize: 2
                 }
             }).then(retryRes => {
                 reservationId = retryRes.body._id;
             });
        }
      });
    });
  });

  beforeEach(() => {
    cy.window().then((win) => {
      win.localStorage.setItem('token', userToken);
      win.localStorage.setItem('user', userInfo);
    });
  });

  it('should order food for a reservation', () => {
    // 1. Visit the Dashboard
    cy.visit('/');

    // 2. Find the reservation card and click "Order Food"
    // We assume the most recent reservation is the one we just created
    cy.contains('Order Food').click();

    // 3. Verify we are on the order food page
    cy.url().should('include', '/order-food/');

    // 4. Wait for menu items to load
    cy.contains('Order Food').should('be.visible');

    // 5. Select items (assuming there are inputs for quantity)
    // We need to find an input for quantity. Based on typical UI, it might be an input type="number"
    // Let's assume the first input is for the first menu item.
    cy.get('input[type="number"]').first().clear().type('2');

    // 6. Submit the order
    cy.get('form').submit();

    // 7. Verify success
    cy.on('window:alert', (str) => {
      expect(str).to.equal('Food order placed successfully!');
    });

    // 8. Should redirect to home
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });
});
