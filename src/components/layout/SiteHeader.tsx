import Link from "next/link";
import { ConnectButton } from "@/components/wallet/ConnectButton";

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link href="/" className="site-header__brand">
        GANYMEDE
      </Link>
      <nav className="site-header__nav" aria-label="Primary">
        <Link href="/">Store</Link>
        <Link href="/publish">Publish</Link>
        <ConnectButton />
      </nav>
    </header>
  );
}
