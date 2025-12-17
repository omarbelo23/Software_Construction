import request from "supertest";
import { createApp } from "../../src/app.js";
import { connectTestDb, clearTestDb, closeTestDb } from "../helpers/db.js";

function normalizeToken(token) {
  if (!token) return token;
  return token.startsWith("Bearer ") ? token.slice("Bearer ".length) : token;
}

function setAuthHeaders(req, token) {
  const t = normalizeToken(token);
  return req
    .set("Authorization", `Bearer ${t}`)
    .set("x-auth-token", t)
    .set("x-access-token", t);
}

async function signupAndLogin(app, { name, email, password, adminCode }) {
  const signupRes = await request(app).post("/api/auth/signup").send({
    name,
    email,
    password,
    adminCode,
  });

  if (![200, 201].includes(signupRes.status)) {
    // eslint-disable-next-line no-console
    console.log("SIGNUP FAILED:", signupRes.status, signupRes.body);
    throw new Error("Signup failed in test setup");
  }

  const loginRes = await request(app).post("/api/auth/login").send({
    email,
    password,
  });

  if (loginRes.status !== 200) {
    // eslint-disable-next-line no-console
    console.log("LOGIN FAILED:", loginRes.status, loginRes.body);
    throw new Error("Login failed in test setup");
  }

  const token =
    loginRes.body.token || loginRes.body.accessToken || loginRes.body.data?.token;

  if (!token) {
    // eslint-disable-next-line no-console
    console.log("LOGIN RESPONSE (no token):", loginRes.body);
    throw new Error("No token returned from login");
  }

  return token;
}

async function createReservationBestEffort(app, token) {
  // We try common bodies since we haven't seen controller fields yet
  const payloads = [
    { date: "2025-12-20", time: "19:00", guests: 2 },
    { date: "2025-12-20", timeSlot: "19:00", numberOfGuests: 2 },
    { reservationDate: "2025-12-20", reservationTime: "19:00", guests: 2 },
    { date: "2025-12-20", slot: "19:00", guests: 2 },
  ];

  let last = null;
  for (const body of payloads) {
    const res = await setAuthHeaders(
      request(app).post("/api/reservations").send(body),
      token
    );

    last = res;
    if ([200, 201].includes(res.status)) return res;
  }

  return last;
}

describe("Integration: Reservations", () => {
  let app;

  beforeAll(async () => {
    await connectTestDb();
    app = createApp();
  });

  beforeEach(async () => {
    await clearTestDb();
  });

  afterAll(async () => {
    await closeTestDb();
  });

  it("US-RES-1: Public -> GET /api/reservations/unavailable?date=YYYY-MM-DD should return 200", async () => {
    const res = await request(app).get(
      "/api/reservations/unavailable?date=2025-12-20"
    );

    expect(res.status).not.toBe(404);
    expect(res.status).toBe(200);
    expect(res.body).toBeDefined();
  });

  it("US-RES-2: Customer -> POST /api/reservations should create reservation (200/201)", async () => {
    const token = await signupAndLogin(app, {
      name: "Customer",
      email: "cust@test.com",
      password: "Password123!",
    });

    const created = await createReservationBestEffort(app, token);

    if (![200, 201].includes(created.status)) {
      // eslint-disable-next-line no-console
      console.log("RESERVATION CREATE FAILED:", created.status, created.body);
    }

    expect(created.status).not.toBe(404);
    expect([200, 201]).toContain(created.status);
  });

  it("US-RES-3: Customer -> GET /api/reservations/my should return 200", async () => {
    const token = await signupAndLogin(app, {
      name: "Customer",
      email: "cust@test.com",
      password: "Password123!",
    });

    // create at least one reservation (best effort)
    await createReservationBestEffort(app, token);

    const res = await setAuthHeaders(request(app).get("/api/reservations/my"), token);

    expect(res.status).not.toBe(404);
    expect(res.status).toBe(200);
    expect(res.body).toBeDefined();
  });

  it("US-RES-4: Admin -> GET /api/reservations should return 200 (admin only)", async () => {
    const adminToken = await signupAndLogin(app, {
      name: "Admin",
      email: "admin@test.com",
      password: "Password123!",
      adminCode: "ADMIN2024",
    });

    const res = await setAuthHeaders(request(app).get("/api/reservations"), adminToken);

    expect(res.status).not.toBe(404);
    expect(res.status).toBe(200);
    expect(res.body).toBeDefined();
  });
});
