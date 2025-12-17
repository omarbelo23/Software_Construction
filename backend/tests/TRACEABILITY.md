# Integration Test Traceability

| User Story ID | Feature | Test File | Test Name |
|---|---|---|---|
| US-AUTH-1 | Signup | tests/integration/auth.test.js | US-AUTH-1: Signup -> should create user |
| US-AUTH-2 | Login | tests/integration/auth.test.js | US-AUTH-2: Login -> should return token |
| US-MENU-1 | View menu | tests/integration/menu.test.js | US-MENU-1: Public -> GET /api/menu should return 200 |
| US-MENU-2 | Protect admin menu create | tests/integration/menu.test.js | US-MENU-2: Admin-only -> POST /api/menu without token should be blocked |
| US-MENU-3 | Prevent customer from admin action | tests/integration/menu.test.js | US-MENU-3: Customer -> POST /api/menu should be forbidden |
| US-MENU-4 | Admin creates menu item | tests/integration/menu.test.js | US-MENU-4: Admin -> POST /api/menu should create item |
| US-RES-1 | Unavailable slots | tests/integration/reservations.test.js | US-RES-1: Public -> GET /unavailable should return 200 |
| US-RES-2 | Create reservation | tests/integration/reservations.test.js | US-RES-2: Customer -> POST /api/reservations should create reservation |
| US-RES-3 | List my reservations | tests/integration/reservations.test.js | US-RES-3: Customer -> GET /my should return 200 |
| US-RES-4 | Admin list all reservations | tests/integration/reservations.test.js | US-RES-4: Admin -> GET /api/reservations should return 200 |
| US-FB-1 | Submit feedback | tests/integration/feedback.test.js | US-FB-1: Customer -> POST /api/feedback should submit feedback |
| US-FB-2 | Admin views feedback | tests/integration/feedback.test.js | US-FB-2: Admin -> GET /api/feedback should return 200 |
| US-HEALTH-1 | Health check | tests/integration/health.test.js | should return 200 and { ok: true } |
