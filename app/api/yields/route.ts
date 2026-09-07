import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type Pool = {
  chain: string;
  project: string;
  symbol: string;
  tvlUsd: number;
  apy: number;
  stablecoin?: boolean;
  pool?: string;
};

export async function GET() {
  const res = await fetch("https://yields.llama.fi/pools", { next: { revalidate: 300 } });
  if (!res.ok) return NextResponse.json({ error: "llama down" }, { status: 502 });
  const json = await res.json();
  const pools = ((json.data || []) as Pool[])
    .filter((p) => p.chain === "BSC" && p.stablecoin && p.tvlUsd > 50_000 && p.apy > 0)
    .sort((a, b) => b.apy - a.apy)
    .slice(0, 8)
    .map((p) => ({
      project: p.project,
      symbol: p.symbol,
      tvlUsd: Math.round(p.tvlUsd),
      apy: Number(p.apy.toFixed(2)),
      pool: p.pool,
    }));
  return NextResponse.json({
    source: "https://yields.llama.fi/pools",
    task: "best stable yield on BSC for 100 USDT, read-only",
    pools,
  });
}
