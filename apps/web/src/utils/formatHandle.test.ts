import { describe, expect, it } from "vitest";
import { formatHandle } from "./formatHandle";

describe("formatHandle", () => {
  it("prepends @ to a bare nickname", () => {
    expect(formatHandle("demo")).toBe("@demo");
  });

  it("does not double the @ when already present", () => {
    expect(formatHandle("@demo")).toBe("@demo");
    expect(formatHandle("@@demo")).toBe("@demo");
  });

  it("trims surrounding whitespace", () => {
    expect(formatHandle("  @demo  ")).toBe("@demo");
  });

  it("falls back for missing nicknames", () => {
    expect(formatHandle("")).toBe("@unknown");
    expect(formatHandle(undefined)).toBe("@unknown");
    expect(formatHandle(null)).toBe("@unknown");
  });
});
