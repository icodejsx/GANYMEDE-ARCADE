"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Account,
  Asset,
  Memo,
  Networks,
  Operation,
  TransactionBuilder,
} from "@stellar/stellar-sdk";
import { signTransaction } from "@stellar/freighter-api";
import { useWallet } from "@/components/wallet/WalletProvider";
import { buildPaymentMemo } from "@/lib/stellar/memo";

type Props = {
  gameId: string;
  priceXlm: string;
  developerWallet: string;
};

export function GamePurchasePanel({
  gameId,
  priceXlm,
  developerWallet,
}: Props) {
  const { address, connect, error: walletError } = useWallet();
  const [status, setStatus] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [filename, setFilename] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const isFree = priceXlm === "0" || Number(priceXlm) === 0;

  const refreshEntitlement = useCallback(async () => {
    if (!address) return;
    const res = await fetch(
      `/api/purchases?gameId=${encodeURIComponent(gameId)}&buyerWallet=${encodeURIComponent(address)}`,
    );
    const data = (await res.json()) as {
      entitled?: boolean;
      downloadUrl?: string;
      filename?: string;
    };
    if (data.entitled && data.downloadUrl) {
      setDownloadUrl(data.downloadUrl);
      setFilename(data.filename || "game.zip");
    }
  }, [address, gameId]);

  useEffect(() => {
    void refreshEntitlement();
  }, [refreshEntitlement]);

  async function claimFree() {
    if (!address) return;
    setBusy(true);
    setStatus(null);
    try {
      const res = await fetch("/api/purchases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId, buyerWallet: address }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Claim failed");
      setDownloadUrl(data.downloadUrl);
      setFilename(data.filename || "game.zip");
      setStatus("Unlocked. Download below.");
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Claim failed");
    } finally {
      setBusy(false);
    }
  }

  async function buyWithXlm() {
    if (!address) return;
    setBusy(true);
    setStatus(null);
    try {
      const horizon =
        process.env.NEXT_PUBLIC_HORIZON_URL ||
        "https://horizon-testnet.stellar.org";
      const network =
        process.env.NEXT_PUBLIC_STELLAR_NETWORK === "public"
          ? Networks.PUBLIC
          : Networks.TESTNET;

      const accountRes = await fetch(`${horizon}/accounts/${address}`);
      if (!accountRes.ok) throw new Error("Could not load buyer account");
      const accountJson = (await accountRes.json()) as {
        sequence: string;
      };
      const account = new Account(address, accountJson.sequence);
      const memo = buildPaymentMemo(gameId);

      const tx = new TransactionBuilder(account, {
        fee: "100000",
        networkPassphrase: network,
      })
        .addOperation(
          Operation.payment({
            destination: developerWallet,
            asset: Asset.native(),
            amount: String(Number(priceXlm)),
          }),
        )
        .addMemo(Memo.text(memo))
        .setTimeout(180)
        .build();

      const signed = await signTransaction(tx.toXDR(), {
        networkPassphrase: network,
        address,
      });
      if (signed.error || !signed.signedTxXdr) {
        throw new Error(signed.error || "Signature rejected");
      }

      const submit = await fetch(`${horizon}/transactions`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `tx=${encodeURIComponent(signed.signedTxXdr)}`,
      });
      const submitJson = (await submit.json()) as {
        hash?: string;
        title?: string;
        extras?: { result_codes?: unknown };
      };
      if (!submit.ok || !submitJson.hash) {
        throw new Error(submitJson.title || "Horizon rejected the transaction");
      }

      const res = await fetch("/api/purchases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gameId,
          buyerWallet: address,
          txHash: submitJson.hash,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Verification failed");
      setDownloadUrl(data.downloadUrl);
      setFilename(data.filename || "game.zip");
      setStatus("Payment verified. Download below.");
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Purchase failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="purchase-panel">
      <p className="purchase-panel__price">
        {isFree ? "FREE" : `${priceXlm} XLM`}
      </p>
      {!address ? (
        <button type="button" className="btn-primary" onClick={() => void connect()}>
          Connect wallet to continue
        </button>
      ) : downloadUrl ? (
        <a
          className="btn-primary"
          href={downloadUrl}
          download={filename || undefined}
          target="_blank"
          rel="noreferrer"
        >
          Download build
        </a>
      ) : (
        <button
          type="button"
          className="btn-primary"
          disabled={busy}
          onClick={() => void (isFree ? claimFree() : buyWithXlm())}
        >
          {busy ? "Working…" : isFree ? "Claim free download" : "Buy with XLM"}
        </button>
      )}
      {walletError ? <p className="wallet-error">{walletError}</p> : null}
      {status ? <p className="purchase-panel__status">{status}</p> : null}
    </div>
  );
}
