import Link from "next/link";
import { GameCard } from "@/components/games/GameCard";
import { mediaUrl } from "@/lib/media";

export type StoreGame = {
  slug: string;
  title: string;
  description: string;
  genre: string;
  priceXlm: string;
  coverCid: string;
};

const GENRES = ["All", "Action", "Puzzle", "Strategy", "Adventure", "Other"];

type Props = {
  games: StoreGame[];
  activeGenre?: string;
};

function priceLabel(priceXlm: string) {
  return priceXlm === "0" || Number(priceXlm) === 0 ? "FREE" : `${priceXlm} XLM`;
}

export function StoreCatalog({ games, activeGenre = "All" }: Props) {
  const featured = games[0];
  const spotlight = games.slice(1, 4);
  const rest = games.slice(1);

  return (
    <div className="store-page">
      <section className="store-hero">
        <div className="store-hero__copy">
          <p className="section-kicker">Ganymede store</p>
          <h1 className="store-hero__title">Find your next build.</h1>
          <p className="section-lead">
            Browse live indie titles on Stellar. Filter by genre, open a page,
            connect Freighter, and unlock downloads with XLM or a free claim.
          </p>
        </div>
        {featured ? (
          <Link href={`/games/${featured.slug}`} className="store-hero__feature">
            <div
              className="store-hero__feature-art"
              style={{ backgroundImage: `url(${mediaUrl(featured.coverCid)})` }}
            />
            <div className="store-hero__feature-shade" />
            <div className="store-hero__feature-copy">
              <span>FEATURED</span>
              <h2>{featured.title}</h2>
              <p>
                {featured.genre} · {priceLabel(featured.priceXlm)}
              </p>
            </div>
          </Link>
        ) : null}
      </section>

      <section className="store-toolbar">
        <div className="store-toolbar__meta">
          <h2>All games</h2>
          <p>{games.length} titles on the floor</p>
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
      </section>

      {spotlight.length > 0 ? (
        <section className="store-spotlight">
          <p className="section-kicker">Spotlight</p>
          <div className="store-spotlight__grid">
            {spotlight.map((game) => (
              <Link
                key={game.slug}
                href={`/games/${game.slug}`}
                className="store-spotlight__card"
              >
                <div
                  className="store-spotlight__art"
                  style={{ backgroundImage: `url(${mediaUrl(game.coverCid)})` }}
                />
                <div className="store-spotlight__copy">
                  <h3>{game.title}</h3>
                  <p>
                    {game.genre} · {priceLabel(game.priceXlm)}
                  </p>
                  <span>{game.description}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <section className="store-grid-wrap">
        <p className="section-kicker">Catalog</p>
        {rest.length === 0 && !featured ? (
          <div className="empty-state empty-state--rich">
            <p className="empty-state__title">No games in this genre.</p>
            <p className="empty-state__body">
              Try another filter, or publish the next title yourself.
            </p>
            <Link href="/publish" className="btn-primary">
              Publish a game
            </Link>
          </div>
        ) : (
          <div className="store-grid">
            {(rest.length > 0 ? rest : games).map((game) => (
              <GameCard key={game.slug} {...game} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
