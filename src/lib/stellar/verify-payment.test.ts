import { afterEach, describe, expect, it, vi } from "vitest";
import { buildPaymentMemo } from "./memo";
import { verifyXlmPayment } from "./verify-payment";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("verifyXlmPayment", () => {
  it("accepts a matching native payment", async () => {
    const gameId = "game123";
    const memo = buildPaymentMemo(gameId);
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo) => {
        const url = String(input);
        if (url.includes("/operations")) {
          return Response.json({
            _embedded: {
              records: [
                {
                  type: "payment",
                  asset_type: "native",
                  from: "GBUYER",
                  to: "GDEV",
                  amount: "3.0000000",
                },
              ],
            },
          });
        }
        return Response.json({
          successful: true,
          memo_type: "text",
          memo,
          source_account: "GBUYER",
        });
      }),
    );

    const result = await verifyXlmPayment({
      txHash: "abc",
      expectedDestination: "GDEV",
      expectedAmountXlm: "3",
      expectedBuyer: "GBUYER",
      expectedGameId: gameId,
    });
    expect(result).toEqual({ ok: true });
  });

  it("rejects amount mismatch", async () => {
    const gameId = "game123";
    const memo = buildPaymentMemo(gameId);
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo) => {
        const url = String(input);
        if (url.includes("/operations")) {
          return Response.json({
            _embedded: {
              records: [
                {
                  type: "payment",
                  asset_type: "native",
                  from: "GBUYER",
                  to: "GDEV",
                  amount: "1.0000000",
                },
              ],
            },
          });
        }
        return Response.json({
          successful: true,
          memo_type: "text",
          memo,
        });
      }),
    );

    const result = await verifyXlmPayment({
      txHash: "abc",
      expectedDestination: "GDEV",
      expectedAmountXlm: "3",
      expectedBuyer: "GBUYER",
      expectedGameId: gameId,
    });
    expect(result.ok).toBe(false);
  });
});
