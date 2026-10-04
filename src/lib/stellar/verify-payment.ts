import { getStellarConfig } from "./config";
import { buildPaymentMemo, parsePaymentMemo } from "./memo";

export type VerifyResult =
  | { ok: true }
  | { ok: false; reason: string };

function normalizeAmount(amount: string): string {
  const n = Number(amount);
  if (!Number.isFinite(n)) return amount;
  return n.toFixed(7).replace(/\.?0+$/, "") || "0";
}

export async function verifyXlmPayment(params: {
  txHash: string;
  expectedDestination: string;
  expectedAmountXlm: string;
  expectedBuyer: string;
  expectedGameId: string;
}): Promise<VerifyResult> {
  const { horizonUrl } = getStellarConfig();
  const txRes = await fetch(`${horizonUrl}/transactions/${params.txHash}`);
  if (!txRes.ok) {
    return { ok: false, reason: "Transaction not found on Horizon" };
  }
  const tx = (await txRes.json()) as {
    successful?: boolean;
    memo?: string;
    memo_type?: string;
    source_account?: string;
  };

  if (!tx.successful) {
    return { ok: false, reason: "Transaction was not successful" };
  }

  const memoText = tx.memo_type === "text" ? tx.memo ?? "" : "";
  const memoGameId = parsePaymentMemo(memoText);
  const expectedMemo = buildPaymentMemo(params.expectedGameId);
  if (!memoGameId || memoText !== expectedMemo) {
    return { ok: false, reason: "Payment memo does not match game" };
  }

  const opsRes = await fetch(
    `${horizonUrl}/transactions/${params.txHash}/operations`,
  );
  if (!opsRes.ok) {
    return { ok: false, reason: "Could not load transaction operations" };
  }
  const opsBody = (await opsRes.json()) as {
    _embedded?: {
      records?: Array<{
        type?: string;
        asset_type?: string;
        from?: string;
        to?: string;
        amount?: string;
      }>;
    };
  };

  const payment = opsBody._embedded?.records?.find(
    (op) => op.type === "payment" && op.asset_type === "native",
  );
  if (!payment) {
    return { ok: false, reason: "No native XLM payment in transaction" };
  }

  if (payment.to !== params.expectedDestination) {
    return { ok: false, reason: "Payment destination mismatch" };
  }
  if (payment.from !== params.expectedBuyer) {
    return { ok: false, reason: "Payment source mismatch" };
  }
  if (
    normalizeAmount(payment.amount ?? "") !==
    normalizeAmount(params.expectedAmountXlm)
  ) {
    return { ok: false, reason: "Payment amount mismatch" };
  }

  return { ok: true };
}
