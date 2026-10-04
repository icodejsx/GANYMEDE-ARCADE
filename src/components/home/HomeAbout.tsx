export function HomeAbout() {
  return (
    <section className="home-section home-about" data-animate="section">
      <div className="home-section__inner home-about__grid">
        <div className="home-about__copy">
          <p className="section-kicker">What we&apos;re building</p>
          <h2 className="section-title">
            A game store that settles on the blockchain.
          </h2>
          <p className="section-lead">
            Ganymede Arcade is an MVP publishing and distribution platform on
            Stellar — closer to itch.io than a bank portal. Developers list a
            game with description, screenshots, and a Windows build. Players
            browse by genre, connect Freighter, and unlock downloads with XLM
            or a free claim.
          </p>
          <ul className="about-points">
            <li>
              <strong>Live storefront</strong>
              <span>
                Browse published titles, prices, and genres in one place.
              </span>
            </li>
            <li>
              <strong>Simple publishing</strong>
              <span>
                Host a page with assets on IPFS — no enterprise onboarding.
              </span>
            </li>
            <li>
              <strong>Wallet-native payouts</strong>
              <span>Buyers pay developers directly in XLM on Stellar.</span>
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
                <strong>Browse · Genre · Price</strong>
              </div>
              <div className="about-visual__chip about-visual__chip--accent">
                <span>STELLAR</span>
                <strong>XLM checkout</strong>
              </div>
              <div className="about-visual__chip">
                <span>IPFS</span>
                <strong>Builds & screenshots</strong>
              </div>
            </div>
            <p className="about-visual__caption">Ganymede · distribution layer</p>
          </div>
        </aside>
      </div>
    </section>
  );
}
