import { describe, expect, it } from "vitest";
import { decode } from "./jwt.decode";

// Unsigned JWT: jwt-decode only base64-decodes the payload, no verification.
const toBase64Url = (obj: object) => Buffer.from(JSON.stringify(obj)).toString("base64url");
const makeToken = (payload: object) => `${toBase64Url({ alg: "none" })}.${toBase64Url(payload)}.`;

describe("decode", () => {
  it("decodes the payload without verifying", () => {
    const token = makeToken({ _id: "abc", role: "USER", exp: 9999999999 });
    const decoded = decode(token);
    expect(decoded._id).toBe("abc");
    expect(decoded.role).toBe("USER");
  });
});
