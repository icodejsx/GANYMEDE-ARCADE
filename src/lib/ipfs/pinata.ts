export function ipfsUrl(cid: string): string {
  const gateway =
    process.env.PINATA_GATEWAY?.replace(/\/$/, "") ||
    "https://gateway.pinata.cloud/ipfs";
  return `${gateway}/${cid}`;
}

export async function uploadToPinata(
  file: Blob,
  filename: string,
): Promise<{ cid: string }> {
  const jwt = process.env.PINATA_JWT;
  if (!jwt) {
    throw new Error("PINATA_JWT is not configured");
  }

  const body = new FormData();
  body.append("file", file, filename);
  body.append("network", "public");

  const res = await fetch("https://uploads.pinata.cloud/v3/files", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
    body,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Pinata upload failed: ${res.status} ${text}`);
  }

  const json = (await res.json()) as {
    data?: { cid?: string };
    cid?: string;
  };
  const cid = json.data?.cid || json.cid;
  if (!cid) {
    throw new Error("Pinata response missing CID");
  }
  return { cid };
}
