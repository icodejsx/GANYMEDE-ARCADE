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
            <p className="section-kicker">Games</p>
            <h2 className="section-title">In the catalog</h2>
            <p className="section-lead section-lead--narrow">
              A few titles from the store. See everything on the catalog page.
            </p>
            <Link href="/store" className="btn-text floor__store-link">
              Full store
            </Link>
          </div>
          <div className="floor__filters" role="navigation" aria-label="Genres">
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
            <p className="empty-state__title">No games listed yet</p>
            <p className="empty-state__body">
              Publish a Windows build to put the first title on the store.
            </p>
            <Link href="/publish" className="btn-primary">
              Publish
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
                    <span>Featured</span>
                    <h3>{featured.title}</h3>
                    <p>
                      {featured.genre} ·{" "}
                      {featured.priceXlm === "0" ||
                      Number(featured.priceXlm) === 0
                        ? "Free"
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
