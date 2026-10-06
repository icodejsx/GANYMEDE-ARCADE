import Link from "next/link";

export function HomeFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand-block">
          <p className="site-footer__brand">GANYMEDE ARCADE</p>
          <p className="site-footer__tagline">
            Indie games on Stellar. Sell in XLM, unlock the build from your
            wallet.
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
            <h3>Stack</h3>
            <span>Stellar + Freighter</span>
            <span>IPFS hosting</span>
            <span>Testnet ready</span>
          </div>
          <div className="site-footer__col">
            <h3>Developers</h3>
            <Link href="/publish">Create a page</Link>
            <span>Windows builds</span>
            <span>Direct XLM payouts</span>
          </div>
        </div>
      </div>

      <div className="site-footer__bottom">
        <p>© {new Date().getFullYear()} Ganymede Arcade</p>
        <p>Built on Stellar</p>
      </div>
    </footer>
  );
}
