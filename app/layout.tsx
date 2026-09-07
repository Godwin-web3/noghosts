import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Berth",
  description: "A berth only if the agent can dock. Live ERC-8004 agents on BSC, hired on ERC-8183.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="wrap">
          <nav className="nav">
            <Link className="brand" href="/">BERTH</Link>
            <div className="muted">
              <Link href="/advantage">Advantage</Link>
              {" · "}
              <Link href="/proof">Proof</Link>
              {" · "}
              BSC 56
            </div>
          </nav>
          {children}
        </div>
      </body>
    </html>
  );
}
