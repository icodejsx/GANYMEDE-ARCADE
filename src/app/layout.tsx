import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { WalletProvider } from "@/components/wallet/WalletProvider";
import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-display-face",
});

const ui = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-ui-face",
});

export const metadata: Metadata = {
  title: "Ganymede Arcade",
  description:
    "Stellar-native game store — publish indie games, pay with XLM, unlock downloads.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${ui.variable}`}>
        <WalletProvider>
          <SiteHeader />
          {children}
        </WalletProvider>
      </body>
    </html>
  );
}
