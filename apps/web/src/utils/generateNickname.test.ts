import { describe, expect, it } from "vitest";
import { generateNickname } from "./generateNickname";

describe("generateNickname", () => {
  it("capitalizes the base name and wraps it with @ prefix", () => {
    const nickname = generateNickname("mehedi");
    expect(nickname.startsWith("@")).toBe(true);
    expect(nickname).toContain("Mehedi");
  });

  it("generates different suffixes across runs", () => {
    const nicknames = new Set(Array.from({ length: 20 }, () => generateNickname("test")));
    expect(nicknames.size).toBeGreaterThan(1);
  });
});
