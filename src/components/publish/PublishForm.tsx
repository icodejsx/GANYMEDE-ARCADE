"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@/components/wallet/WalletProvider";

const GENRES = ["Action", "Puzzle", "Strategy", "Adventure", "Other"];
const MAX_IMAGE = 1_000_000;

async function uploadFile(file: File) {
  const body = new FormData();
  body.append("file", file);
  const res = await fetch("/api/uploads", { method: "POST", body });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Upload failed");
  return data as { cid: string; filename: string };
}

export function PublishForm() {
  const { address, connect, error: walletError } = useWallet();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState(GENRES[0]);
  const [priceXlm, setPriceXlm] = useState("0");
  const [cover, setCover] = useState<File | null>(null);
  const [screenshots, setScreenshots] = useState<FileList | null>(null);
  const [build, setBuild] = useState<File | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!address) {
      setStatus("Connect your Freighter wallet first.");
      return;
    }
    if (!cover || !build) {
      setStatus("Cover image and Windows build are required.");
      return;
    }
    if (cover.size > MAX_IMAGE) {
      setStatus("Cover must be 1MB or smaller.");
      return;
    }

    setBusy(true);
    setStatus("Uploading assets to IPFS…");
    try {
      const coverUp = await uploadFile(cover);
      const shotCids: string[] = [];
      if (screenshots) {
        for (const file of Array.from(screenshots)) {
          if (file.size > MAX_IMAGE) {
            throw new Error(`${file.name} exceeds 1MB`);
          }
          const up = await uploadFile(file);
          shotCids.push(up.cid);
        }
      }
      setStatus("Uploading build…");
      const buildUp = await uploadFile(build);

      setStatus("Saving game page…");
      const res = await fetch("/api/games", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          genre,
          priceXlm: String(priceXlm || "0"),
          developerWallet: address,
          coverCid: coverUp.cid,
          screenshotCids: shotCids,
          buildCid: buildUp.cid,
          buildFilename: build.name || buildUp.filename,
        }),
      });
      const game = await res.json();
      if (!res.ok) throw new Error(game.error || "Publish failed");
      router.push(`/games/${game.slug}`);
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Publish failed");
      setBusy(false);
    }
  }

  return (
    <form className="publish-form" onSubmit={(e) => void onSubmit(e)}>
      {!address ? (
        <button type="button" className="btn-primary" onClick={() => void connect()}>
          Connect wallet to publish
        </button>
      ) : (
        <p className="muted">Publishing as {address}</p>
      )}

      <label>
        Title
        <input value={title} onChange={(e) => setTitle(e.target.value)} required />
      </label>
      <label>
        Description
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={5}
        />
      </label>
      <label>
        Genre
        <select value={genre} onChange={(e) => setGenre(e.target.value)}>
          {GENRES.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </label>
      <label>
        Price (XLM, 0 = free)
        <input
          type="number"
          min="0"
          step="0.0000001"
          value={priceXlm}
          onChange={(e) => setPriceXlm(e.target.value)}
          required
        />
      </label>
      <label>
        Cover image (≤1MB, ~1920×1080)
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setCover(e.target.files?.[0] || null)}
          required
        />
      </label>
      <label>
        Screenshots
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => setScreenshots(e.target.files)}
        />
      </label>
      <label>
        Windows build
        <input
          type="file"
          onChange={(e) => setBuild(e.target.files?.[0] || null)}
          required
        />
      </label>

      <button type="submit" className="btn-primary" disabled={busy || !address}>
        {busy ? "Publishing…" : "Publish game"}
      </button>
      {walletError ? <p className="wallet-error">{walletError}</p> : null}
      {status ? <p className="purchase-panel__status">{status}</p> : null}
    </form>
  );
}
