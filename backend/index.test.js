import request from 'supertest';
import app from './server.js';
import authService from './src/services/authService.js';
import reservationService from './src/services/reservationService.js';
import feedbackService from './src/services/feedbackService.js';
import reservationFoodOrderService from './src/services/reservationFoodOrderService.js';
import authMiddleware from './src/middleware/authMiddleware.js';
import jwt from 'jsonwebtoken';

// ============ MOCK ALL SERVICES ============
jest.mock('./src/services/authService.js');
jest.mock('./src/services/reservationService.js');
jest.mock('./src/services/feedbackService.js');
jest.mock('./src/services/reservationFoodOrderService.js');

// ============ MOCK AUTH MIDDLEWARE ============
jest.mock('./src/middleware/authMiddleware.js', () => ({
  default: (req, res, next) => {
    req.user = { id: 'test-user-123', role: 'customer' };
    next();
  }
}));

// ============ MOCK JWT ============
const mockToken = 'mock-jwt-token-12345';
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(() => mockToken),
  verify: jest.fn(() => ({ id: 'test-user-123' }))
}));

// ============ TEST DATA ============
const testUser = {
  _id: 'test-user-123',
  name: 'John Doe',
  email: 'john@example.com',
  password: 'hashedPassword123',
  role: 'customer'
};

const testReservation = {
  _id: 'reservation-123',
  userId: 'test-user-123',
  date: '2025-12-20',
  time: '18:00',
  partySize: 4,
  status: 'confirmed'
};

const testFeedback = {
  _id: 'feedback-123',
  userId: 'test-user-123',
  reservationId: 'reservation-123',
  rating: 5,
  comment: 'Excellent experience!'
};

const testMenuItem = {
  _id: 'menu-item-123',
  name: 'Grilled Salmon',
  price: 25.99,
  description: 'Fresh grilled salmon'
};

const testFoodOrder = {
  _id: 'order-123',
  reservationId: 'reservation-123',
  items: [
    { menuItemId: 'menu-item-123', quantity: 2 }
  ],
  totalPrice: 51.98
};

// ============ SETUP & TEARDOWN ============
describe('Restaurant API - Unit Tests', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ============ USER REGISTRATION & LOGIN TESTS ============
  describe('User Registration & Login', () => {
    
    describe('POST /api/auth/signup', () => {
      
      test('should register a new user successfully with valid data', async () => {
        authService.signup.mockResolvedValue({
          user: testUser,
          token: mockToken
        });

        const response = await request(app)
          .post('/api/auth/signup')
          .send({
            name: 'John Doe',
            email: 'john@example.com',
            password: 'Password123!',
            adminCode: null
          });

        expect(response.status).toBe(200);
        expect(response.body.token).toBe(mockToken);
        expect(response.body.user).toBeDefined();
        expect(authService.signup).toHaveBeenCalledWith(
          'John Doe',
          'john@example.com',
          'Password123!',
          null
        );
      });

      test('should fail when email is missing', async () => {
        authService.signup.mockRejectedValue(
          new Error('Email is required')
        );

        const response = await request(app)
          .post('/api/auth/signup')
          .send({
            name: 'John Doe',
            password: 'Password123!'
          });

        expect(response.status).toBe(400);
        expect(response.body.error).toContain('Email is required');
      });

      test('should fail when password is missing', async () => {
        authService.signup.mockRejectedValue(
          new Error('Password is required')
        );

        const response = await request(app)
          .post('/api/auth/signup')
          .send({
            name: 'John Doe',
            email: 'john@example.com'
          });

        expect(response.status).toBe(400);
        expect(response.body.error).toContain('Password is required');
      });

      test('should fail when email is invalid format', async () => {
        authService.signup.mockRejectedValue(
          new Error('Invalid email format')
        );

        const response = await request(app)
          .post('/api/auth/signup')
          .send({
            name: 'John Doe',
            email: 'invalid-email',
            password: 'Password123!'
          });

        expect(response.status).toBe(400);
        expect(response.body.error).toContain('Invalid email format');
      });

      test('should fail when email already exists', async () => {
        authService.signup.mockRejectedValue(
          new Error('Email already registered')
        );

        const response = await request(app)
          .post('/api/auth/signup')
          .send({
            name: 'Jane Doe',
            email: 'john@example.com',
            password: 'Password123!'
          });

        expect(response.status).toBe(400);
        expect(response.body.error).toContain('Email already registered');
      });

      test('should fail when password is too short', async () => {
        authService.signup.mockRejectedValue(
          new Error('Password must be at least 8 characters')
        );

        const response = await request(app)
          .post('/api/auth/signup')
          .send({
            name: 'John Doe',
            email: 'john@example.com',
            password: 'Pass123'
          });

        expect(response.status).toBe(400);
        expect(response.body.error).toContain('at least 8 characters');
      });
    });

    describe('POST /api/auth/login', () => {
      
      test('should login successfully with valid credentials', async () => {
        authService.login.mockResolvedValue({
          user: testUser,
          token: mockToken
        });

        const response = await request(app)
          .post('/api/auth/login')
          .send({
            email: 'john@example.com',
            password: 'Password123!'
          });

        expect(response.status).toBe(200);
        expect(response.body.token).toBe(mockToken);
        expect(response.body.user).toBeDefined();
        expect(authService.login).toHaveBeenCalledWith(
          'john@example.com',
          'Password123!'
        );
      });

      test('should fail when email is missing', async () => {
        authService.login.mockRejectedValue(
          new Error('Email is required')
        );

        const response = await request(app)
          .post('/api/auth/login')
          .send({
            password: 'Password123!'
          });

        expect(response.status).toBe(400);
        expect(response.body.error).toContain('Email is required');
      });

      test('should fail when password is missing', async () => {
        authService.login.mockRejectedValue(
          new Error('Password is required')
        );

        const response = await request(app)
          .post('/api/auth/login')
          .send({
            email: 'john@example.com'
          });

        expect(response.status).toBe(400);
        expect(response.body.error).toContain('Password is required');
      });

      test('should fail with incorrect email', async () => {
        authService.login.mockRejectedValue(
          new Error('Invalid email or password')
        );

        const response = await request(app)
          .post('/api/auth/login')
          .send({
            email: 'wrong@example.com',
            password: 'Password123!'
          });

        expect(response.status).toBe(400);
        expect(response.body.error).toContain('Invalid email or password');
      });

      test('should fail with incorrect password', async () => {
        authService.login.mockRejectedValue(
          new Error('Invalid email or password')
        );

        const response = await request(app)
          .post('/api/auth/login')
          .send({
            email: 'john@example.com',
            password: 'WrongPassword123!'
          });

        expect(response.status).toBe(400);
        expect(response.body.error).toContain('Invalid email or password');
      });

      test('should fail when email format is invalid', async () => {
        authService.login.mockRejectedValue(
          new Error('Invalid email format')
        );

        const response = await request(app)
          .post('/api/auth/login')
          .send({
            email: 'invalid-email',
            password: 'Password123!'
          });

        expect(response.status).toBe(400);
        expect(response.body.error).toContain('Invalid email format');
      });
    });
  });

  // ============ TABLE RESERVATION TESTS ============
  describe('Table Reservation', () => {

    describe('POST /api/reservations', () => {

      test('should create a reservation successfully with valid data', async () => {
        reservationService.createReservation.mockResolvedValue(testReservation);

        const response = await request(app)
          .post('/api/reservations')
          .send({
            date: '2025-12-20',
            time: '18:00',
            partySize: 4
          });

        expect(response.status).toBe(200);
        expect(response.body).toEqual(testReservation);
        expect(reservationService.createReservation).toHaveBeenCalledWith(
          'test-user-123',
          '2025-12-20',
          '18:00',
          4
        );
      });

      test('should fail when date is missing', async () => {
        reservationService.createReservation.mockRejectedValue(
          new Error('Date is required')
        );

        const response = await request(app)
          .post('/api/reservations')
          .send({
            time: '18:00',
            partySize: 4
          });

        expect(response.status).toBe(400);
        expect(response.body.message).toContain('Date is required');
      });

      test('should fail when time is missing', async () => {
        reservationService.createReservation.mockRejectedValue(
          new Error('Time is required')
        );

        const response = await request(app)
          .post('/api/reservations')
          .send({
            date: '2025-12-20',
            partySize: 4
          });

        expect(response.status).toBe(400);
        expect(response.body.message).toContain('Time is required');
      });

      test('should fail when partySize is missing', async () => {
        reservationService.createReservation.mockRejectedValue(
          new Error('Party size is required')
        );

        const response = await request(app)
          .post('/api/reservations')
          .send({
            date: '2025-12-20',
            time: '18:00'
          });

        expect(response.status).toBe(400);
        expect(response.body.message).toContain('Party size is required');
      });

      test('should fail when partySize is invalid (zero or negative)', async () => {
        reservationService.createReservation.mockRejectedValue(
          new Error('Party size must be at least 1')
        );

        const response = await request(app)
          .post('/api/reservations')
          .send({
            date: '2025-12-20',
            time: '18:00',
            partySize: 0
          });

        expect(response.status).toBe(400);
        expect(response.body.message).toContain('Party size must be at least 1');
      });

      test('should fail when partySize exceeds maximum', async () => {
        reservationService.createReservation.mockRejectedValue(
          new Error('Party size cannot exceed 20')
        );

        const response = await request(app)
          .post('/api/reservations')
          .send({
            date: '2025-12-20',
            time: '18:00',
            partySize: 50
          });

        expect(response.status).toBe(400);
        expect(response.body.message).toContain('cannot exceed');
      });

      test('should fail when date is in the past', async () => {
        reservationService.createReservation.mockRejectedValue(
          new Error('Cannot book reservation in the past')
        );

        const response = await request(app)
          .post('/api/reservations')
          .send({
            date: '2020-01-01',
            time: '18:00',
            partySize: 4
          });

        expect(response.status).toBe(400);
        expect(response.body.message).toContain('past');
      });

      test('should fail when time slot is unavailable', async () => {
        reservationService.createReservation.mockRejectedValue(
          new Error('Time slot is not available')
        );

        const response = await request(app)
          .post('/api/reservations')
          .send({
            date: '2025-12-20',
            time: '18:00',
            partySize: 4
          });

        expect(response.status).toBe(400);
        expect(response.body.message).toContain('not available');
      });
    });

    describe('GET /api/reservations/unavailable', () => {

      test('should return unavailable time slots for a given date', async () => {
        const unavailableSlots = ['12:00', '12:30', '13:00'];
        reservationService.getUnavailableSlots.mockResolvedValue(unavailableSlots);

        const response = await request(app)
          .get('/api/reservations/unavailable')
          .query({ date: '2025-12-20' });

        expect(response.status).toBe(200);
        expect(response.body.unavailableSlots).toEqual(unavailableSlots);
      });

      test('should fail when date query parameter is missing', async () => {
        const response = await request(app)
          .get('/api/reservations/unavailable');

        expect(response.status).toBe(400);
        expect(response.body.message).toContain('Date is required');
      });
    });

    describe('GET /api/reservations', () => {

      test('should list user reservations successfully', async () => {
        reservationService.getUserReservations.mockResolvedValue([testReservation]);

        const response = await request(app)
          .get('/api/reservations');

        expect(response.status).toBe(200);
        expect(response.body).toEqual([testReservation]);
        expect(reservationService.getUserReservations).toHaveBeenCalledWith('test-user-123');
      });

      test('should return empty array when user has no reservations', async () => {
        reservationService.getUserReservations.mockResolvedValue([]);

        const response = await request(app)
          .get('/api/reservations');

        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
      });
    });

    describe('DELETE /api/reservations/:id', () => {

      test('should delete a reservation successfully', async () => {
        reservationService.deleteReservation.mockResolvedValue({ 
          message: 'Reservation deleted successfully' 
        });

        const response = await request(app)
          .delete('/api/reservations/reservation-123');

        expect(response.status).toBe(200);
        expect(reservationService.deleteReservation).toHaveBeenCalledWith('reservation-123');
      });

      test('should fail when reservation does not exist', async () => {
        reservationService.deleteReservation.mockRejectedValue(
          new Error('Reservation not found')
        );

        const response = await request(app)
          .delete('/api/reservations/invalid-id');

        expect(response.status).toBe(400);
        expect(response.body.error).toContain('Reservation not found');
      });
    });
  });

  // ============ ORDER FOOD TESTS ============
  describe('Order Food', () => {

    describe('POST /api/reservation-food-orders/:reservationId', () => {

      test('should order food successfully with valid menu items', async () => {
        reservationFoodOrderService.orderFood.mockResolvedValue(testFoodOrder);

        const response = await request(app)
          .post('/api/reservation-food-orders/reservation-123')
          .send({
            items: [
              { menuItemId: 'menu-item-123', quantity: 2 }
            ]
          });

        expect(response.status).toBe(201);
        expect(response.body.message).toContain('Food ordered successfully');
        expect(reservationFoodOrderService.orderFood).toHaveBeenCalledWith(
          'reservation-123',
          [{ menuItemId: 'menu-item-123', quantity: 2 }]
        );
      });

      test('should fail when items array is empty', async () => {
        reservationFoodOrderService.orderFood.mockRejectedValue(
          new Error('At least one item must be ordered')
        );

        const response = await request(app)
          .post('/api/reservation-food-orders/reservation-123')
          .send({
            items: []
          });

        expect(response.status).toBe(400);
        expect(response.body.error).toContain('At least one item');
      });

      test('should fail when items array is missing', async () => {
        reservationFoodOrderService.orderFood.mockRejectedValue(
          new Error('Items array is required')
        );

        const response = await request(app)
          .post('/api/reservation-food-orders/reservation-123')
          .send({});

        expect(response.status).toBe(400);
        expect(response.body.error).toContain('Items array is required');
      });

      test('should fail when menuItemId is missing', async () => {
        reservationFoodOrderService.orderFood.mockRejectedValue(
          new Error('Menu item ID is required for each item')
        );

        const response = await request(app)
          .post('/api/reservation-food-orders/reservation-123')
          .send({
            items: [{ quantity: 2 }]
          });

        expect(response.status).toBe(400);
        expect(response.body.error).toContain('Menu item ID');
      });

      test('should fail when quantity is missing', async () => {
        reservationFoodOrderService.orderFood.mockRejectedValue(
          new Error('Quantity is required for each item')
        );

        const response = await request(app)
          .post('/api/reservation-food-orders/reservation-123')
          .send({
            items: [{ menuItemId: 'menu-item-123' }]
          });

        expect(response.status).toBe(400);
        expect(response.body.error).toContain('Quantity is required');
      });

      test('should fail when quantity is zero or negative', async () => {
        reservationFoodOrderService.orderFood.mockRejectedValue(
          new Error('Quantity must be at least 1')
        );

        const response = await request(app)
          .post('/api/reservation-food-orders/reservation-123')
          .send({
            items: [{ menuItemId: 'menu-item-123', quantity: 0 }]
          });

        expect(response.status).toBe(400);
        expect(response.body.error).toContain('Quantity must be at least 1');
      });

      test('should fail when menu item does not exist', async () => {
        reservationFoodOrderService.orderFood.mockRejectedValue(
          new Error('Menu item not found')
        );

        const response = await request(app)
          .post('/api/reservation-food-orders/reservation-123')
          .send({
            items: [{ menuItemId: 'invalid-menu-id', quantity: 2 }]
          });

        expect(response.status).toBe(400);
        expect(response.body.error).toContain('Menu item not found');
      });

      test('should fail when reservation does not exist', async () => {
        reservationFoodOrderService.orderFood.mockRejectedValue(
          new Error('Reservation not found')
        );

        const response = await request(app)
          .post('/api/reservation-food-orders/invalid-reservation')
          .send({
            items: [{ menuItemId: 'menu-item-123', quantity: 2 }]
          });

        expect(response.status).toBe(400);
        expect(response.body.error).toContain('Reservation not found');
      });

      test('should handle multiple food items in one order', async () => {
        const multiItemOrder = {
          ...testFoodOrder,
          items: [
            { menuItemId: 'menu-item-123', quantity: 2 },
            { menuItemId: 'menu-item-456', quantity: 1 }
          ]
        };
        reservationFoodOrderService.orderFood.mockResolvedValue(multiItemOrder);

        const response = await request(app)
          .post('/api/reservation-food-orders/reservation-123')
          .send({
            items: [
              { menuItemId: 'menu-item-123', quantity: 2 },
              { menuItemId: 'menu-item-456', quantity: 1 }
            ]
          });

        expect(response.status).toBe(201);
        expect(response.body.orderedItems.items.length).toBe(2);
      });
    });

    describe('GET /api/reservation-food-orders/:reservationId', () => {

      test('should get food order for a reservation', async () => {
        reservationFoodOrderService.getOrderForReservation.mockResolvedValue(testFoodOrder);

        const response = await request(app)
          .get('/api/reservation-food-orders/reservation-123');

        expect(response.status).toBe(200);
        expect(response.body).toEqual(testFoodOrder);
      });

      test('should fail when reservation has no food order', async () => {
        reservationFoodOrderService.getOrderForReservation.mockRejectedValue(
          new Error('No food order found for this reservation')
        );

        const response = await request(app)
          .get('/api/reservation-food-orders/reservation-123');

        expect(response.status).toBe(400);
        expect(response.body.error).toContain('No food order found');
      });
    });
  });

  // ============ FEEDBACK SUBMISSION TESTS ============
  describe('Feedback Submission', () => {

    describe('POST /api/feedback', () => {

      test('should submit feedback successfully with valid data', async () => {
        feedbackService.submitFeedback.mockResolvedValue(testFeedback);

        const response = await request(app)
          .post('/api/feedback')
          .send({
            reservationId: 'reservation-123',
            rating: 5,
            comment: 'Excellent experience!'
          });

        expect(response.status).toBe(200);
        expect(response.body).toEqual(testFeedback);
        expect(feedbackService.submitFeedback).toHaveBeenCalledWith(
          'test-user-123',
          'reservation-123',
          5,
          'Excellent experience!'
        );
      });

      test('should fail when reservationId is missing', async () => {
        feedbackService.submitFeedback.mockRejectedValue(
          new Error('Reservation ID is required')
        );

        const response = await request(app)
          .post('/api/feedback')
          .send({
            rating: 5,
            comment: 'Excellent experience!'
          });

        expect(response.status).toBe(400);
        expect(response.body.error).toContain('Reservation ID is required');
      });

      test('should fail when rating is missing', async () => {
        feedbackService.submitFeedback.mockRejectedValue(
          new Error('Rating is required')
        );

        const response = await request(app)
          .post('/api/feedback')
          .send({
            reservationId: 'reservation-123',
            comment: 'Excellent experience!'
          });

        expect(response.status).toBe(400);
        expect(response.body.error).toContain('Rating is required');
      });

      test('should fail when comment is missing', async () => {
        feedbackService.submitFeedback.mockRejectedValue(
          new Error('Comment is required')
        );

        const response = await request(app)
          .post('/api/feedback')
          .send({
            reservationId: 'reservation-123',
            rating: 5
          });

        expect(response.status).toBe(400);
        expect(response.body.error).toContain('Comment is required');
      });

      test('should fail when rating is below minimum (1)', async () => {
        feedbackService.submitFeedback.mockRejectedValue(
          new Error('Rating must be between 1 and 5')
        );

        const response = await request(app)
          .post('/api/feedback')
          .send({
            reservationId: 'reservation-123',
            rating: 0,
            comment: 'Bad experience'
          });

        expect(response.status).toBe(400);
        expect(response.body.error).toContain('between 1 and 5');
      });

      test('should fail when rating exceeds maximum (5)', async () => {
        feedbackService.submitFeedback.mockRejectedValue(
          new Error('Rating must be between 1 and 5')
        );

        const response = await request(app)
          .post('/api/feedback')
          .send({
            reservationId: 'reservation-123',
            rating: 10,
            comment: 'Excellent!'
          });

        expect(response.status).toBe(400);
        expect(response.body.error).toContain('between 1 and 5');
      });

      test('should fail when comment is empty string', async () => {
        feedbackService.submitFeedback.mockRejectedValue(
          new Error('Comment cannot be empty')
        );

        const response = await request(app)
          .post('/api/feedback')
          .send({
            reservationId: 'reservation-123',
            rating: 5,
            comment: ''
          });

        expect(response.status).toBe(400);
        expect(response.body.error).toContain('empty');
      });

      test('should fail when comment is too long', async () => {
        feedbackService.submitFeedback.mockRejectedValue(
          new Error('Comment must not exceed 500 characters')
        );

        const response = await request(app)
          .post('/api/feedback')
          .send({
            reservationId: 'reservation-123',
            rating: 5,
            comment: 'a'.repeat(501)
          });

        expect(response.status).toBe(400);
        expect(response.body.error).toContain('500 characters');
      });

      test('should fail when reservation does not exist', async () => {
        feedbackService.submitFeedback.mockRejectedValue(
          new Error('Reservation not found')
        );

        const response = await request(app)
          .post('/api/feedback')
          .send({
            reservationId: 'invalid-reservation',
            rating: 5,
            comment: 'Good service'
          });

        expect(response.status).toBe(400);
        expect(response.body.error).toContain('Reservation not found');
      });

      test('should accept rating as decimal (e.g., 4.5)', async () => {
        const feedbackWithDecimal = { ...testFeedback, rating: 4.5 };
        feedbackService.submitFeedback.mockResolvedValue(feedbackWithDecimal);

        const response = await request(app)
          .post('/api/feedback')
          .send({
            reservationId: 'reservation-123',
            rating: 4.5,
            comment: 'Very good experience'
          });

        expect(response.status).toBe(200);
        expect(response.body.rating).toBe(4.5);
      });
    });

    describe('GET /api/feedback', () => {

      test('should retrieve all feedback successfully', async () => {
        feedbackService.getAllFeedback.mockResolvedValue([testFeedback]);

        const response = await request(app)
          .get('/api/feedback');

        expect(response.status).toBe(200);
        expect(response.body).toEqual([testFeedback]);
      });

      test('should return empty array when there is no feedback', async () => {
        feedbackService.getAllFeedback.mockResolvedValue([]);

        const response = await request(app)
          .get('/api/feedback');

        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
      });

      test('should return multiple feedback entries', async () => {
        const multipleFeedback = [
          testFeedback,
          { ...testFeedback, _id: 'feedback-456', rating: 4 }
        ];
        feedbackService.getAllFeedback.mockResolvedValue(multipleFeedback);

        const response = await request(app)
          .get('/api/feedback');

        expect(response.status).toBe(200);
        expect(response.body.length).toBe(2);
      });
    });
  });
});
