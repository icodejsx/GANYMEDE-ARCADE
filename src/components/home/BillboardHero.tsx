import Link from "next/link";

export function BillboardHero() {
  return (
    <section className="billboard" aria-label="Ganymede Arcade hero">
      <div className="billboard__glow" />
      <div className="billboard__copy">
        <p className="billboard__eyebrow">GANYMEDE ARCADE</p>
        <h1>
          Games worth
          <br />
          shipping.
        </h1>
        <p className="billboard__support">
          Indie titles on Stellar. Buy with XLM. Developers paid directly.
        </p>
        <div className="billboard__actions">
          <a href="#floor" className="btn-primary">
            Browse games
          </a>
          <Link href="/publish" className="btn-text">
            PUBLISH →
          </Link>
        </div>
      </div>
    </section>
  );
}
