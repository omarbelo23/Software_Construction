# TDD Evidence - Frontend E2E Tests

**Date:** December 18, 2025
**Framework:** Cypress
**Status:** ✅ All Tests Passed

## Test Execution Summary

| Spec File | Tests | Passing | Failing | Duration |
|-----------|-------|---------|---------|----------|
| `auth.cy.js` | 2 | 2 | 0 | 3s |
| `feedback.cy.js` | 1 | 1 | 0 | 1s |
| `order_food.cy.js` | 1 | 1 | 0 | 1s |
| `reservation.cy.js` | 1 | 1 | 0 | 1s |
| **Total** | **5** | **5** | **0** | **7s** |

---

## Traceability Matrix

| User Story ID | User Story Description | Test File | Test Case | Status |
|---------------|------------------------|-----------|-----------|--------|
| **US-AUTH-1** | User Registration | `auth.cy.js` | `should register a new user successfully` |  PASS |
| **US-AUTH-2** | User Login | `auth.cy.js` | `should login with the registered user` |  PASS |
| **US-RES-1** | Table Reservation | `reservation.cy.js` | `should create a table reservation successfully` |  PASS |
| **US-ORDER-1** | Order Food | `order_food.cy.js` | `should order food for a reservation` |  PASS |
| **US-FB-1** | Feedback Submission | `feedback.cy.js` | `should submit feedback for a reservation` |  PASS |

---

## Detailed Test Logs

### 1. User Registration & Login (`auth.cy.js`)
- **Goal:** Verify that a new user can sign up and then log in.
- **Steps:**
    1. Visit `/signup`.
    2. Fill in name, email, password.
    3. Submit form.
    4. Verify success alert and redirect to login.
    5. Visit `/login`.
    6. Fill in email, password.
    7. Submit form.
    8. Verify redirect to dashboard.
- **Result:**  Passed

### 2. Table Reservation (`reservation.cy.js`)
- **Goal:** Verify that a logged-in user can create a reservation.
- **Steps:**
    1. Login via API (setup).
    2. Visit `/reserve`.
    3. Select date and time.
    4. Submit form.
    5. Verify success alert.
- **Result:** Passed

### 3. Order Food (`order_food.cy.js`)
- **Goal:** Verify that a user can order food for an existing reservation.
- **Steps:**
    1. Login and create reservation via API (setup).
    2. Visit Dashboard `/`.
    3. Click "Order Food" on reservation card.
    4. Select menu items.
    5. Submit order.
    6. Verify success alert.
- **Result:**  Passed

### 4. Feedback Submission (`feedback.cy.js`)
- **Goal:** Verify that a user can leave feedback for a reservation.
- **Steps:**
    1. Login and create reservation via API (setup).
    2. Visit Dashboard `/`.
    3. Click "Feedback" on reservation card.
    4. Fill in rating and comment in modal.
    5. Submit feedback.
    6. Verify success alert and modal closure.
- **Result:**  Passed
