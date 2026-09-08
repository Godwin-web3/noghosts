import Link from "next/link";

export function DocsNav() {
  return (
    <aside className="docs-nav">
      <p className="kicker faint">MANUAL</p>
      <Link href="/docs">How Berth works</Link>
      <Link href="/docs/hire">Hire</Link>
      <Link href="/docs/rails">Rails</Link>
    </aside>
  );
}
