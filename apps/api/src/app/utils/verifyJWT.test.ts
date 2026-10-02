import { describe, expect, it } from "vitest";
import AppError from "../errors/AppError";
import { createToken, verifyToken } from "./verifyJWT";

const SECRET = "test-secret-that-is-long-enough-for-hs256";
const payload = {
  name: "Test User",
  email: "test@example.com",
  role: "USER" as const,
  status: "ACTIVE" as const,
  nickName: "tester",
};

describe("JWT helpers", () => {
  it("round-trips a token", () => {
    const token = createToken(payload, SECRET, "1h");
    const decoded = verifyToken(token, SECRET);
    if (decoded instanceof Error) throw decoded;
    expect(decoded.email).toBe(payload.email);
    expect(decoded.role).toBe("USER");
  });

  it("rejects tokens signed with another secret", () => {
    const token = createToken(payload, SECRET, "1h");
    try {
      verifyToken(token, "wrong-secret");
      throw new Error("should have thrown");
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect((error as AppError).statusCode).toBe(401);
    }
  });
});
