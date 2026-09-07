import type { Metadata } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans, Newsreader } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const sans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
});
const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});
const serif = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "Berth",
  description: "A berth only if the agent can dock.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable} ${serif.variable}`}>
      <body>
        <div className="shell">
          <header className="top">
            <Link className="brand" href="/">
              <img src="/mark.svg" alt="" />
              BERTH
            </Link>
            <nav className="nav-right">
              <Link href="/advantage">Advantage</Link>
              <Link href="/proof">Proof</Link>
              <span className="pill">BSC 56</span>
            </nav>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
