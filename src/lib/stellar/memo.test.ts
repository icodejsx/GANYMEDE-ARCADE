import { describe, expect, it } from "vitest";
import { buildPaymentMemo, parsePaymentMemo } from "./memo";

describe("payment memo", () => {
  it("builds a ganymede memo under 28 bytes", () => {
    const memo = buildPaymentMemo("clxyz1234567890");
    expect(memo.startsWith("ganymede:")).toBe(true);
    expect(new TextEncoder().encode(memo).length).toBeLessThanOrEqual(28);
  });

  it("parses a valid memo", () => {
    expect(parsePaymentMemo("ganymede:abc")).toBe("abc");
  });

  it("returns null for invalid memo", () => {
    expect(parsePaymentMemo("nope")).toBeNull();
  });
});
