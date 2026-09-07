import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "No-Ghosts — Intent Hire on BSC",
  description: "Type what you need. Only alive, receipt-backed ERC-8004 agents show up.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="wrap">
          <nav className="nav">
            <Link className="brand" href="/">NO-GHOSTS</Link>
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
