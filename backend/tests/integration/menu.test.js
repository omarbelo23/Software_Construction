import request from "supertest";
import { createApp } from "../../src/app.js";
import { connectTestDb, clearTestDb, closeTestDb } from "../helpers/db.js";

/**
 * Some projects read token from:
 * - Authorization: Bearer <token>
 * - x-auth-token: <token>
 * - x-access-token: <token>
 * So we send all to avoid "Invalid token".
 */
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

async function postFirstWorkingMenuCreate(app, token) {
  const payloads = [
    // most likely
    { name: "Pasta", description: "Creamy pasta", price: 140, category: "Main" },
    // alt shapes
    { title: "Pasta", description: "Creamy pasta", price: 140, category: "Main" },
    {
      itemName: "Pasta",
      itemDescription: "Creamy pasta",
      itemPrice: 140,
      itemCategory: "Main",
    },
  ];

  let last = null;

  for (const body of payloads) {
    let req = request(app).post("/api/menu").send(body);
    req = setAuthHeaders(req, token);
    const res = await req;
    last = res;

    if ([200, 201].includes(res.status)) return res;
  }

  return last;
}

describe("Integration: Menu", () => {
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

  it("US-MENU-1: Public -> GET /api/menu should return 200", async () => {
    const res = await request(app).get("/api/menu");

    expect(res.status).not.toBe(404);
    expect(res.status).toBe(200);
    expect(res.body).toBeDefined();
  });

  it("US-MENU-2: Admin-only -> POST /api/menu without token should be blocked", async () => {
    const res = await request(app).post("/api/menu").send({
      name: "Burger",
      description: "Tasty burger",
      price: 120,
      category: "Main",
    });

    expect([401, 403]).toContain(res.status);
  });

  it("US-MENU-3: Customer -> POST /api/menu should be forbidden (not admin)", async () => {
    const token = await signupAndLogin(app, {
      name: "Customer",
      email: "cust@test.com",
      password: "Password123!",
    });

    const res = await setAuthHeaders(
      request(app).post("/api/menu").send({
        name: "Pizza",
        description: "Cheesy",
        price: 150,
        category: "Main",
      }),
      token
    );

    expect([401, 403]).toContain(res.status);
  });

  it("US-MENU-4: Admin -> POST /api/menu should create item (200/201)", async () => {
    const adminToken = await signupAndLogin(app, {
      name: "Admin",
      email: "admin@test.com",
      password: "Password123!",
      adminCode: "ADMIN2024",
    });

    const created = await postFirstWorkingMenuCreate(app, adminToken);

    if (![200, 201].includes(created.status)) {
      // eslint-disable-next-line no-console
      console.log("MENU CREATE FAILED:", created.status, created.body);
    }

    expect(created.status).not.toBe(404);
    expect([200, 201]).toContain(created.status);
  });
});
