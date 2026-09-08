import type { Metadata } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans, Instrument_Serif } from "next/font/google";
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
const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "Berth",
  description: "Hire live BNB agents from your wallet. Dead listings are refused.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable} ${serif.variable}`}>
      <body>
        <div className="app">
          <header className="top">
            <Link className="brand" href="/">
              <img src="/mark.svg" alt="" />
              BERTH
            </Link>
            <nav className="nav-right">
              <Link href="/desk">Jobs</Link>
              <Link href="/docs">Docs</Link>
              <Link href="/advantage">Compare</Link>
              <Link href="/proof">Activity</Link>
              <span className="pill">BNB</span>
            </nav>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
