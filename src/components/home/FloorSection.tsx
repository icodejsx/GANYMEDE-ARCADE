import Link from "next/link";
import { GameCard } from "@/components/games/GameCard";
import { mediaUrl } from "@/lib/media";

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
    <section id="floor" className="home-section floor">
      <div className="home-section__inner">
        <div className="floor__intro">
          <div>
            <p className="section-kicker">On the floor</p>
            <h2 className="section-title">Live games</h2>
            <p className="section-lead section-lead--narrow">
              A preview of titles on Ganymede. Open the full store for the complete
              catalog.
            </p>
            <Link href="/store" className="btn-text floor__store-link">
              OPEN FULL STORE →
            </Link>
          </div>
          <div className="floor__filters">
            {GENRES.map((genre) => {
              const href =
                genre === "All"
                  ? "/store"
                  : `/store?genre=${encodeURIComponent(genre)}`;
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
          <div className="empty-state empty-state--rich">
            <p className="empty-state__title">The floor is open.</p>
            <p className="empty-state__body">
              No titles listed yet. Be the first developer to publish a Windows
              build and go live on Stellar.
            </p>
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
                      backgroundImage: `url(${mediaUrl(featured.coverCid)})`,
                    }}
                  />
                  <div className="featured-tile__copy">
                    <span>FEATURED</span>
                    <h3>{featured.title}</h3>
                    <p>
                      {featured.genre} ·{" "}
                      {featured.priceXlm === "0" ||
                      Number(featured.priceXlm) === 0
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
      </div>
    </section>
  );
}
