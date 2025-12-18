// backend/tests/unit/services/authService.test.js
import { jest, describe, it, expect, beforeEach } from "@jest/globals";

/**
 * ESM NOTE:
 * In "type": "module", use jest.unstable_mockModule + dynamic import
 * so the module under test imports the mocked versions.
 */

// 1) Create mock function objects (Jest spies) first
const userRepoMock = {
  findByEmail: jest.fn(),
  create: jest.fn(),
  findAll: jest.fn(),
  findById: jest.fn(),
  deleteById: jest.fn(),
};

const bcryptMock = {
  hash: jest.fn(),
  compare: jest.fn(),
};

const jwtMock = {
  sign: jest.fn(),
};

// 2) Register ESM mocks BEFORE importing the module under test
jest.unstable_mockModule("../../../src/repositories/userRepository.js", () => ({
  default: userRepoMock,
}));

jest.unstable_mockModule("bcrypt", () => ({
  default: bcryptMock,
}));

jest.unstable_mockModule("jsonwebtoken", () => ({
  default: jwtMock,
}));

// 3) Now import the module under test AFTER mocks are registered
const { default: authService } = await import("../../../src/services/authService.js");

describe("Unit: authService", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // stable env for tests
    process.env.JWT_SECRET = "test_jwt_secret_change_me";
    process.env.ADMIN_CODE = "ADMIN2024";
  });

  // =========================
  // SIGNUP
  // =========================
  describe("signup()", () => {
    it("US-AUTH-UNIT-1: signup -> creates customer when adminCode is missing", async () => {
      userRepoMock.findByEmail.mockResolvedValue(null);
      bcryptMock.hash.mockResolvedValue("hashed_pw");

      userRepoMock.create.mockResolvedValue({
        _id: "u1",
        name: "Ali",
        email: "ali@test.com",
        passwordHash: "hashed_pw",
        role: "customer",
      });

      const result = await authService.signup("Ali", "ali@test.com", "123456");

      expect(userRepoMock.findByEmail).toHaveBeenCalledWith("ali@test.com");
      expect(bcryptMock.hash).toHaveBeenCalledWith("123456", 10);

      expect(userRepoMock.create).toHaveBeenCalledWith({
        name: "Ali",
        email: "ali@test.com",
        passwordHash: "hashed_pw",
        role: "customer",
      });

      expect(result).toEqual({
        id: "u1",
        name: "Ali",
        email: "ali@test.com",
        role: "customer",
      });
    });

    it("US-AUTH-UNIT-2: signup -> creates admin when adminCode matches", async () => {
      userRepoMock.findByEmail.mockResolvedValue(null);
      bcryptMock.hash.mockResolvedValue("hashed_pw");

      userRepoMock.create.mockResolvedValue({
        _id: "admin1",
        name: "Admin",
        email: "admin@test.com",
        passwordHash: "hashed_pw",
        role: "admin",
      });

      const result = await authService.signup(
        "Admin",
        "admin@test.com",
        "123456",
        "ADMIN2024"
      );

      expect(result).toEqual({
        id: "admin1",
        name: "Admin",
        email: "admin@test.com",
        role: "admin",
      });
    });

    it("US-AUTH-UNIT-3: signup -> throws if email already exists", async () => {
      userRepoMock.findByEmail.mockResolvedValue({ _id: "existing" });

      await expect(
        authService.signup("Ali", "ali@test.com", "123456")
      ).rejects.toThrow("Email already exists");
    });
  });

  // =========================
  // LOGIN
  // =========================
  describe("login()", () => {
    it("US-AUTH-UNIT-4: login -> returns token + safe user when password matches", async () => {
      userRepoMock.findByEmail.mockResolvedValue({
        _id: "u3",
        name: "Ali",
        email: "ali@test.com",
        passwordHash: "hashed_pw",
        role: "customer",
      });

      bcryptMock.compare.mockResolvedValue(true);
      jwtMock.sign.mockReturnValue("fake_token");

      const result = await authService.login("ali@test.com", "123456");

      expect(userRepoMock.findByEmail).toHaveBeenCalledWith("ali@test.com");
      expect(bcryptMock.compare).toHaveBeenCalledWith("123456", "hashed_pw");

      expect(jwtMock.sign).toHaveBeenCalledWith(
        { id: "u3", role: "customer" },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      expect(result).toEqual({
        token: "fake_token",
        user: {
          id: "u3",
          name: "Ali",
          email: "ali@test.com",
          role: "customer",
        },
      });
    });

    it("US-AUTH-UNIT-5: login -> throws invalid credentials when user not found", async () => {
      userRepoMock.findByEmail.mockResolvedValue(null);

      await expect(authService.login("x@test.com", "123")).rejects.toThrow(
        "Invalid credentials"
      );
    });

    it("US-AUTH-UNIT-6: login -> throws invalid credentials when password mismatch", async () => {
      userRepoMock.findByEmail.mockResolvedValue({
        _id: "u1",
        email: "ali@test.com",
        passwordHash: "hashed_pw",
        role: "customer",
      });

      bcryptMock.compare.mockResolvedValue(false);

      await expect(authService.login("ali@test.com", "wrong")).rejects.toThrow(
        "Invalid credentials"
      );
    });
  });
});