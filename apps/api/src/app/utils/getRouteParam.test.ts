import { describe, expect, it } from "vitest";
import { getRouteParam } from "./getRouteParam";

describe("getRouteParam", () => {
  it("returns a plain string param", () => {
    expect(getRouteParam("abc", "id")).toBe("abc");
  });

  it("takes the first value of an array param (Express 5 splats)", () => {
    expect(getRouteParam(["abc", "def"], "id")).toBe("abc");
  });

  it("throws when the param is missing", () => {
    expect(() => getRouteParam(undefined, "id")).toThrow("id is required");
    expect(() => getRouteParam("", "id")).toThrow("id is required");
  });
});
