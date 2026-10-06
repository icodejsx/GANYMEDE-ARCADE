import Link from "next/link";

export function HomeStellar() {
  return (
    <section className="home-section home-stellar" data-animate="section">
      <div className="home-section__inner home-stellar__inner">
        <div className="home-stellar__copy">
          <p className="section-kicker">Stellar</p>
          <h2 className="section-title">Payments land in the developer wallet.</h2>
          <p className="section-lead">
            Checkout uses Freighter. Paid titles are checked on Horizon before
            the download unlocks. Free titles unlock after connect. Testnet by
            default; mainnet when you set it.
          </p>
          <div className="home-stellar__actions">
            <Link href="/store" className="btn-primary">
              Open store
            </Link>
            <Link href="/publish" className="btn-ghost">
              Publish a game
            </Link>
          </div>
        </div>
        <aside className="home-stellar__panel" aria-label="Stack">
          <div className="pillar" data-animate="pillar">
            <span>Network</span>
            <strong>Stellar</strong>
            <p>Testnet now. Mainnet via env when you ship.</p>
          </div>
          <div className="pillar" data-animate="pillar">
            <span>Files</span>
            <strong>IPFS</strong>
            <p>Screenshots and Windows builds stay pinned.</p>
          </div>
          <div className="pillar" data-animate="pillar">
            <span>Wallet</span>
            <strong>Freighter</strong>
            <p>One connect to publish, buy, claim, and unlock.</p>
          </div>
        </aside>
      </div>
    </section>
  );
}
