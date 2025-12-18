# TDD Evidence - Backend Unit Tests

**Date:** December 18, 2025
**Framework:** Jest (Unit Testing)
**Status:** ✅ All Tests Passed

## Test Execution Summary

| Spec File | Tests | Passing | Failing | Duration |
|-----------|-------|---------|---------|----------|
| `tests/unit/services/authService.test.js` | 6 | 6 | 0 | ~0.1s |
| `tests/unit/controllers/authController.test.js` | 4 | 4 | 0 | ~0.1s |
| **Total** | **10** | **10** | **0** | **~0.3s** |

---

## Traceability Matrix

| User Story ID | User Story Description | Test File | Test Case | Status |
|---------------|------------------------|-----------|-----------|--------|
| **US-AUTH-UNIT-1** | Signup (Customer) | `authService.test.js` | `signup -> creates customer when adminCode is missing` | ✅ PASS |
| **US-AUTH-UNIT-2** | Signup (Admin) | `authService.test.js` | `signup -> creates admin when adminCode matches` | ✅ PASS |
| **US-AUTH-UNIT-3** | Signup (Duplicate) | `authService.test.js` | `signup -> throws if email already exists` | ✅ PASS |
| **US-AUTH-UNIT-4** | Login (Success) | `authService.test.js` | `login -> returns token + safe user when password matches` | ✅ PASS |
| **US-AUTH-UNIT-5** | Login (User Not Found) | `authService.test.js` | `login -> throws invalid credentials when user not found` | ✅ PASS |
| **US-AUTH-UNIT-6** | Login (Wrong Password) | `authService.test.js` | `login -> throws invalid credentials when password mismatch` | ✅ PASS |
| **US-AUTH-CTRL-1** | Signup Controller (Success) | `authController.test.js` | `signup -> returns json(user) on success` | ✅ PASS |
| **US-AUTH-CTRL-2** | Signup Controller (Fail) | `authController.test.js` | `signup -> returns 400 with error message on failure` | ✅ PASS |
| **US-AUTH-CTRL-3** | Login Controller (Success) | `authController.test.js` | `login -> returns json(data) on success` | ✅ PASS |
| **US-AUTH-CTRL-4** | Login Controller (Fail) | `authController.test.js` | `login -> returns 400 on failure` | ✅ PASS |

---

## Detailed Test Logs

### 1. Auth Service Unit Tests (`authService.test.js`)
- **Goal:** Verify business logic for signup and login in isolation, mocking repositories and external libraries (bcrypt, jsonwebtoken).
- **Key Scenarios:**
    - **Signup:**
        - Mocks `userRepo.findByEmail` to return `null` (new user).
        - Mocks `bcrypt.hash`.
        - Verifies `userRepo.create` is called with correct data (hashing password, default role).
        - Verifies Admin role assignment when correct code is provided.
        - Verifies error thrown when email exists.
    - **Login:**
        - Mocks `userRepo.findByEmail` to return a user.
        - Mocks `bcrypt.compare` for password validation.
        - Mocks `jwt.sign` for token generation.
        - Verifies correct token and user data returned on success.
        - Verifies "Invalid credentials" error on wrong email or password.
- **Result:** ✅ Passed

### 2. Auth Controller Unit Tests (`authController.test.js`)
- **Goal:** Verify the controller handles HTTP requests and responses correctly, mocking the service layer.
- **Key Scenarios:**
    - **Signup:**
        - Mocks `authService.signup` to resolve with user data.
        - Verifies `res.json` is called with that data.
        - Mocks `authService.signup` to reject.
        - Verifies `res.status(400)` and `res.json({ error: ... })` are called.
    - **Login:**
        - Mocks `authService.login` to resolve with token.
        - Verifies `res.json` is called with token.
        - Mocks `authService.login` to reject.
        - Verifies `res.status(400)` and error response.
- **Result:** ✅ Passed
