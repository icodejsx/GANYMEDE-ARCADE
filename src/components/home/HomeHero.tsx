import Link from "next/link";

export function HomeHero() {
  return (
    <section className="home-hero" aria-label="Ganymede Arcade">
      <div className="home-hero__stage" aria-hidden="true">
        <div className="home-hero__orb home-hero__orb--a" />
        <div className="home-hero__orb home-hero__orb--b" />
        <div className="home-hero__grid" />
        <div className="home-hero__horizon" />
      </div>

      <div className="home-hero__content">
        <p className="home-hero__brand" data-animate="hero">
          GANYMEDE ARCADE
        </p>
        <h1 className="home-hero__title" data-animate="hero">
          Indie games,
          <br />
          paid in XLM.
        </h1>
        <p className="home-hero__support" data-animate="hero">
          List a Windows build, sell it for Stellar, unlock downloads from a
          wallet.
        </p>
        <div className="home-hero__actions" data-animate="hero">
          <Link href="/store" className="btn-primary">
            Browse games
          </Link>
          <Link href="/publish" className="btn-ghost">
            Publish
          </Link>
        </div>
      </div>
    </section>
  );
}
