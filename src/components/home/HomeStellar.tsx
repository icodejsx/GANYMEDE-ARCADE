import Link from "next/link";

export function HomeStellar() {
  return (
    <section className="home-section home-stellar" data-animate="section">
      <div className="home-section__inner home-stellar__inner">
        <div className="home-stellar__copy">
          <p className="section-kicker">Why Stellar</p>
          <h2 className="section-title">
            Less friction between a sale and a developer&apos;s wallet.
          </h2>
          <p className="section-lead">
            Traditional stores bury payouts in banking and tax procedures —
            especially hard outside the US. On Ganymede Arcade, payment is
            native XLM: the buyer signs in Freighter, the developer receives
            funds on Stellar. Free games unlock after wallet connect. Paid
            games verify on Horizon before download.
          </p>
          <div className="home-stellar__actions">
            <Link href="/store" className="btn-primary">
              See the store
            </Link>
            <Link href="/publish" className="btn-text">
              START PUBLISHING →
            </Link>
          </div>
        </div>
        <aside className="home-stellar__panel" aria-label="Platform pillars">
          <div className="pillar" data-animate="pillar">
            <span>Network</span>
            <strong>Stellar testnet ready</strong>
            <p>Mainnet via environment when you ship for real.</p>
          </div>
          <div className="pillar" data-animate="pillar">
            <span>Assets</span>
            <strong>IPFS builds & art</strong>
            <p>Screenshots and Windows builds pinned for download.</p>
          </div>
          <div className="pillar" data-animate="pillar">
            <span>Access</span>
            <strong>Freighter wallet</strong>
            <p>Connect once to publish, buy, claim, and unlock.</p>
          </div>
        </aside>
      </div>
    </section>
  );
}
