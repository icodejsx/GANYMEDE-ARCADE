"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  isConnected,
  requestAccess,
  getAddress,
  getNetwork,
} from "@stellar/freighter-api";

type WalletContextValue = {
  address: string | null;
  network: string | null;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
};

const WalletContext = createContext<WalletContextValue | null>(null);

function expectedNetworkLabel() {
  return process.env.NEXT_PUBLIC_STELLAR_NETWORK === "public"
    ? "PUBLIC"
    : "TESTNET";
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [network, setNetwork] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const connect = useCallback(async () => {
    setError(null);
    try {
      const connected = await isConnected();
      if (!connected.isConnected && connected.error) {
        setError(
          "Freighter is not available. Install it from https://www.freighter.app",
        );
        return;
      }

      const access = await requestAccess();
      if (access.error || !access.address) {
        setError(access.error || "Wallet access was denied");
        return;
      }

      const net = await getNetwork();
      const networkPassphrase = net.networkPassphrase || net.network || "";
      const label = (net.network || "").toUpperCase();
      const expected = expectedNetworkLabel();
      const ok =
        label.includes(expected) ||
        (expected === "TESTNET" &&
          networkPassphrase.includes("Test SDF Network")) ||
        (expected === "PUBLIC" &&
          networkPassphrase.includes("Public Global Stellar"));

      if (!ok) {
        setError(
          `Wrong network. Switch Freighter to ${expected.toLowerCase()}.`,
        );
        setAddress(null);
        setNetwork(label || null);
        return;
      }

      const addr = await getAddress();
      setAddress(addr.address || access.address);
      setNetwork(label || expected);
    } catch {
      setError(
        "Could not connect to Freighter. Is the extension installed and unlocked?",
      );
    }
  }, []);

  const disconnect = useCallback(() => {
    setAddress(null);
    setNetwork(null);
    setError(null);
  }, []);

  const value = useMemo(
    () => ({ address, network, error, connect, disconnect }),
    [address, network, error, connect, disconnect],
  );

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) {
    throw new Error("useWallet must be used within WalletProvider");
  }
  return ctx;
}
