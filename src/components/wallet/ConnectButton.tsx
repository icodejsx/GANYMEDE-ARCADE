"use client";

import { useWallet } from "./WalletProvider";

function truncate(address: string) {
  return `${address.slice(0, 4)}…${address.slice(-4)}`;
}

export function ConnectButton() {
  const { address, connect, disconnect, error } = useWallet();

  return (
    <div className="connect-wrap">
      {address ? (
        <button type="button" className="btn-connect" onClick={disconnect}>
          {truncate(address)}
        </button>
      ) : (
        <button type="button" className="btn-connect" onClick={() => void connect()}>
          Connect wallet
        </button>
      )}
      {error ? <p className="wallet-error">{error}</p> : null}
    </div>
  );
}
