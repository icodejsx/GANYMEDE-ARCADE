export function HomeAbout() {
  return (
    <section className="home-section home-about" data-animate="section">
      <div className="home-section__inner home-about__grid">
        <div className="home-about__copy">
          <p className="section-kicker">About</p>
          <h2 className="section-title">A small store on Stellar.</h2>
          <p className="section-lead">
            Ganymede Arcade lets developers put a game online with a page,
            screenshots, and a Windows build. Players filter by genre, connect
            Freighter, and unlock the file with XLM, or claim it if it&apos;s
            free.
          </p>
          <ul className="about-points">
            <li>
              <strong>Storefront</strong>
              <span>Published titles with genre and price in one catalog.</span>
            </li>
            <li>
              <strong>Publishing</strong>
              <span>Upload assets to IPFS and go live from your wallet.</span>
            </li>
            <li>
              <strong>Payouts</strong>
              <span>Buyers send XLM straight to the developer address.</span>
            </li>
          </ul>
        </div>

        <aside className="about-visual" aria-hidden="true">
          <div className="about-visual__frame">
            <div className="about-visual__glow" />
            <div className="about-visual__system">
              <div className="about-visual__orbit about-visual__orbit--outer" />
              <div className="about-visual__orbit about-visual__orbit--inner" />
              <div className="about-visual__moon" />
            </div>
            <div className="about-visual__stack">
              <div className="about-visual__chip">
                <span>STORE</span>
                <strong>Catalog & prices</strong>
              </div>
              <div className="about-visual__chip about-visual__chip--accent">
                <span>STELLAR</span>
                <strong>XLM payments</strong>
              </div>
              <div className="about-visual__chip">
                <span>IPFS</span>
                <strong>Builds hosted</strong>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
