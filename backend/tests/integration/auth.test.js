import request from "supertest";
import { createApp } from "../../src/app.js";
import { connectTestDb, clearTestDb, closeTestDb } from "../helpers/db.js";

describe("Integration: Auth", () => {
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

  it("US-AUTH-1: Signup -> should create user (200/201)", async () => {
    const res = await request(app).post("/api/auth/signup").send({
      name: "Ali Ahmed",
      email: "ali@test.com",
      password: "Password123!",
    });

    // helpful debug if it fails
    if (![200, 201].includes(res.status)) {
      // eslint-disable-next-line no-console
      console.log("SIGNUP FAILED:", res.status, res.body);
    }

    expect([200, 201]).toContain(res.status);
  });

  it("US-AUTH-2: Login -> should return token (200)", async () => {
    // 1) signup first (same user)
    const signupRes = await request(app).post("/api/auth/signup").send({
      name: "Ali Ahmed",
      email: "ali@test.com",
      password: "Password123!",
    });

    if (![200, 201].includes(signupRes.status)) {
      // eslint-disable-next-line no-console
      console.log("SIGNUP FAILED:", signupRes.status, signupRes.body);
    }
    expect([200, 201]).toContain(signupRes.status);

    // 2) try login with the most common payload shapes (projects differ)
    const candidates = [
      { email: "ali@test.com", password: "Password123!" },
      { username: "ali@test.com", password: "Password123!" },
      { identifier: "ali@test.com", password: "Password123!" },
      { email: "ali@test.com", pass: "Password123!" },
    ];

    let lastRes = null;

    for (const body of candidates) {
      const res = await request(app).post("/api/auth/login").send(body);
      lastRes = res;

      // success
      if (res.status === 200) {
        const token =
          res.body.token ||
          res.body.accessToken ||
          res.body.data?.token ||
          res.body.data?.accessToken;

        expect(token).toBeTruthy();
        return;
      }
    }

    // If we reached here, login never returned 200.
    // Print why (this is the key to fixing it)
    // eslint-disable-next-line no-console
    console.log("LOGIN FAILED (last attempt):", lastRes?.status, lastRes?.body);

    expect(lastRes?.status).toBe(200);
  });
});
