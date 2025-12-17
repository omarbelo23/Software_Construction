import request from "supertest";
import { createApp } from "../../src/app.js";

describe("Integration: Health", () => {
  it("should return 200 and { ok: true }", async () => {
    const app = createApp();

    const res = await request(app).get("/health");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });
  });
});
