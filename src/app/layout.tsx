import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { WalletProvider } from "@/components/wallet/WalletProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ganymede Arcade",
  description: "Stellar-native game store — publish, pay in XLM, download.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <WalletProvider>
          <SiteHeader />
          {children}
        </WalletProvider>
      </body>
    </html>
  );
}
