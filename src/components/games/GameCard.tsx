import Link from "next/link";
import { ipfsUrl } from "@/lib/ipfs/pinata";

type Props = {
  slug: string;
  title: string;
  genre: string;
  priceXlm: string;
  coverCid: string;
  compact?: boolean;
};

export function GameCard({
  slug,
  title,
  genre,
  priceXlm,
  coverCid,
  compact,
}: Props) {
  const price =
    priceXlm === "0" || Number(priceXlm) === 0 ? "FREE" : `${priceXlm} XLM`;

  return (
    <Link href={`/games/${slug}`} className={`game-card ${compact ? "game-card--compact" : ""}`}>
      <div
        className="game-card__cover"
        style={{ backgroundImage: `url(${ipfsUrl(coverCid)})` }}
      />
      <div className="game-card__meta">
        <h3>{title}</h3>
        <p>
          {genre} · {price}
        </p>
      </div>
    </Link>
  );
}
