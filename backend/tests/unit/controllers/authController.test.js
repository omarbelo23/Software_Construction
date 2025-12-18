import { jest, describe, it, expect, beforeEach } from "@jest/globals";

// Mock authService module
const authServiceMock = {
  signup: jest.fn(),
  login: jest.fn(),
  getAllUsers: jest.fn(),
  deleteUser: jest.fn(),
};

jest.unstable_mockModule("../../../src/services/authService.js", () => ({
  default: authServiceMock,
}));

const { default: authController } = await import("../../../src/controllers/authController.js");

function mockRes() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
}

describe("Unit: authController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("US-AUTH-CTRL-1: signup -> returns json(user) on success", async () => {
    // Arrange
    const req = {
      body: { name: "Ali", email: "ali@test.com", password: "123", adminCode: "" },
    };
    const res = mockRes();

    authServiceMock.signup.mockResolvedValue({
      id: "u1",
      name: "Ali",
      email: "ali@test.com",
      role: "customer",
    });

    // Act
    await authController.signup(req, res);

    // Assert
    expect(authServiceMock.signup).toHaveBeenCalledWith("Ali", "ali@test.com", "123", "");
    expect(res.json).toHaveBeenCalledWith({
      id: "u1",
      name: "Ali",
      email: "ali@test.com",
      role: "customer",
    });
    expect(res.status).not.toHaveBeenCalled(); // no error
  });

  it("US-AUTH-CTRL-2: signup -> returns 400 with error message on failure", async () => {
    const req = { body: { name: "Ali", email: "ali@test.com", password: "123" } };
    const res = mockRes();

    authServiceMock.signup.mockRejectedValue(new Error("Email already exists"));

    await authController.signup(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Email already exists" });
  });

  it("US-AUTH-CTRL-3: login -> returns json(data) on success", async () => {
    const req = { body: { email: "ali@test.com", password: "123" } };
    const res = mockRes();

    authServiceMock.login.mockResolvedValue({ token: "t", user: { id: "u1" } });

    await authController.login(req, res);

    expect(authServiceMock.login).toHaveBeenCalledWith("ali@test.com", "123");
    expect(res.json).toHaveBeenCalledWith({ token: "t", user: { id: "u1" } });
  });

  it("US-AUTH-CTRL-4: login -> returns 400 on failure", async () => {
    const req = { body: { email: "ali@test.com", password: "wrong" } };
    const res = mockRes();

    authServiceMock.login.mockRejectedValue(new Error("Invalid credentials"));

    await authController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Invalid credentials" });
  });
});