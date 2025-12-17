describe('Feedback Submission', () => {
  let userToken;
  let userInfo;
  let reservationId;

  before(() => {
    // 1. Setup: Register, Login, and Create a Reservation
    const timestamp = new Date().getTime();
    const user = {
      name: `Feedback User ${timestamp}`,
      email: `feedbackuser${timestamp}@example.com`,
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
          partySize: 4
        },
        failOnStatusCode: false // Don't fail if slot is taken, we'll handle it or retry
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
                  partySize: 4
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

  it('should submit feedback for a reservation', () => {
    // 1. Visit the Dashboard
    cy.visit('/');

    // 2. Find the reservation card and click "Feedback"
    // Note: There might be multiple "Feedback" buttons (one in card, one in quick actions).
    // We want the one in the card. The card buttons are usually inside a container with other buttons.
    // Let's target the button specifically associated with a reservation card.
    // Or just click the first "Feedback" button that is NOT the quick action one.
    // The Quick Action one says "Leave Feedback". The card one says "Feedback".
    cy.contains('button', 'Feedback').click();

    // 3. Wait for Modal to open
    cy.contains('Leave Feedback').should('be.visible');

    // 4. Fill in the form (Modal)
    // The modal inputs have IDs rating and comment
    cy.get('input[id="rating"]').clear().type('5');
    cy.get('textarea[id="comment"]').type('Great food and service!');

    // 5. Submit the feedback
    cy.get('button[type="submit"]').click();

    // 6. Verify success
    cy.on('window:alert', (str) => {
      expect(str).to.equal('Feedback submitted successfully!');
    });

    // 7. Verify modal closed (optional)
    cy.get('[role="dialog"]').should('not.exist');
  });
});
