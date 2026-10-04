import Link from "next/link";

export function HomeFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand-block">
          <p className="site-footer__brand">GANYMEDE ARCADE</p>
          <p className="site-footer__tagline">
            A Stellar-native store for indie games — publish, sell in XLM, and
            unlock downloads without traditional payout friction.
          </p>
        </div>

        <div className="site-footer__cols">
          <div className="site-footer__col">
            <h3>Product</h3>
            <Link href="/store">Store</Link>
            <Link href="/#how">How it works</Link>
            <Link href="/publish">Publish</Link>
          </div>
          <div className="site-footer__col">
            <h3>Platform</h3>
            <span>Stellar + Freighter</span>
            <span>IPFS asset hosting</span>
            <span>Testnet-ready MVP</span>
          </div>
          <div className="site-footer__col">
            <h3>Developers</h3>
            <Link href="/publish">Create a game page</Link>
            <span>Windows builds</span>
            <span>Direct XLM payouts</span>
          </div>
        </div>
      </div>

      <div className="site-footer__bottom">
        <p>© {new Date().getFullYear()} Ganymede Arcade. MVP prototype.</p>
        <p>Built on Stellar · Not affiliated with itch.io or Steam.</p>
      </div>
    </footer>
  );
}
