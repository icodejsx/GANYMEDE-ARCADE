import { Networks } from "@stellar/stellar-sdk";

export function getStellarConfig() {
  const network =
    process.env.STELLAR_NETWORK === "public" ? "public" : "testnet";
  const horizonUrl =
    process.env.HORIZON_URL ||
    (network === "public"
      ? "https://horizon.stellar.org"
      : "https://horizon-testnet.stellar.org");
  const networkPassphrase =
    network === "public" ? Networks.PUBLIC : Networks.TESTNET;
  return { network, horizonUrl, networkPassphrase };
}
