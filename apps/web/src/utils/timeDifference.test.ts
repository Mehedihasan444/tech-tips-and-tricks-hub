import { describe, expect, it } from "vitest";
import { timeDifference } from "./timeDifference";

const ago = (ms: number) => new Date(Date.now() - ms).toISOString();

describe("timeDifference", () => {
  it("reports days", () => {
    expect(timeDifference(ago(2 * 24 * 60 * 60 * 1000))).toBe("2 day(s) ago");
  });

  it("reports hours", () => {
    expect(timeDifference(ago(3 * 60 * 60 * 1000))).toBe("3 hour(s) ago");
  });

  it("reports minutes", () => {
    expect(timeDifference(ago(5 * 60 * 1000))).toBe("5 minute(s) ago");
  });

  it("reports seconds for just-now timestamps", () => {
    expect(timeDifference(ago(10 * 1000))).toBe("10 second(s) ago");
  });
});
