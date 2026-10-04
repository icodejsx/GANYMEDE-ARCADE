import Link from "next/link";
import { GameCard } from "@/components/games/GameCard";
import { ipfsUrl } from "@/lib/ipfs/pinata";

export type FloorGame = {
  slug: string;
  title: string;
  genre: string;
  priceXlm: string;
  coverCid: string;
};

const GENRES = ["All", "Action", "Puzzle", "Strategy", "Adventure", "Other"];

type Props = {
  games: FloorGame[];
  activeGenre?: string;
};

export function FloorSection({ games, activeGenre = "All" }: Props) {
  const featured = games[0];
  const stack = games.slice(1, 3);
  const rest = games.slice(3);

  return (
    <section id="floor" className="floor">
      <div className="floor__header">
        <p className="floor__label">ON THE FLOOR</p>
        <div className="floor__filters">
          {GENRES.map((genre) => {
            const href = genre === "All" ? "/" : `/?genre=${encodeURIComponent(genre)}`;
            const active = activeGenre === genre;
            return (
              <Link
                key={genre}
                href={href}
                className={active ? "filter filter--active" : "filter"}
              >
                {genre}
              </Link>
            );
          })}
        </div>
      </div>

      {games.length === 0 ? (
        <div className="empty-state">
          <p>No games on the floor yet.</p>
          <Link href="/publish" className="btn-primary">
            Publish the first title
          </Link>
        </div>
      ) : (
        <>
          <div className="floor__featured">
            {featured ? (
              <Link href={`/games/${featured.slug}`} className="featured-tile">
                <div
                  className="featured-tile__art"
                  style={{
                    backgroundImage: `url(${ipfsUrl(featured.coverCid)})`,
                  }}
                />
                <div className="featured-tile__copy">
                  <span>FEATURED</span>
                  <h2>{featured.title}</h2>
                  <p>
                    {featured.genre} ·{" "}
                    {featured.priceXlm === "0" || Number(featured.priceXlm) === 0
                      ? "FREE"
                      : `${featured.priceXlm} XLM`}
                  </p>
                </div>
              </Link>
            ) : null}
            <div className="floor__stack">
              {stack.map((game) => (
                <GameCard key={game.slug} {...game} compact />
              ))}
            </div>
          </div>
          {rest.length > 0 ? (
            <div className="floor__row">
              {rest.map((game) => (
                <GameCard key={game.slug} {...game} />
              ))}
            </div>
          ) : null}
        </>
      )}
    </section>
  );
}
