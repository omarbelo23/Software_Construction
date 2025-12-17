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

async function submitFeedbackBestEffort(app, token) {
  const payloads = [
    { message: "Great service!", rating: 5 },
    { comment: "Great service!", rating: 5 },
    { feedback: "Great service!", stars: 5 },
    { text: "Great service!" },
  ];

  let last = null;
  for (const body of payloads) {
    const res = await setAuthHeaders(
      request(app).post("/api/feedback").send(body),
      token
    );

    last = res;
    if ([200, 201].includes(res.status)) return res;
  }

  return last;
}

describe("Integration: Feedback", () => {
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

  it("US-FB-1: Customer -> POST /api/feedback should submit feedback (200/201)", async () => {
    const token = await signupAndLogin(app, {
      name: "Customer",
      email: "cust@test.com",
      password: "Password123!",
    });

    const created = await submitFeedbackBestEffort(app, token);

    if (![200, 201].includes(created.status)) {
      // eslint-disable-next-line no-console
      console.log("FEEDBACK SUBMIT FAILED:", created.status, created.body);
    }

    expect(created.status).not.toBe(404);
    expect([200, 201]).toContain(created.status);
  });

  it("US-FB-2: Admin -> GET /api/feedback should return 200 (admin only)", async () => {
    const adminToken = await signupAndLogin(app, {
      name: "Admin",
      email: "admin@test.com",
      password: "Password123!",
      adminCode: "ADMIN2024",
    });

    const res = await setAuthHeaders(request(app).get("/api/feedback"), adminToken);

    expect(res.status).not.toBe(404);
    expect(res.status).toBe(200);
    expect(res.body).toBeDefined();
  });
});
