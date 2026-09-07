import { NextResponse } from "next/server";
import { isAddress } from "viem";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const address = url.searchParams.get("address") || "";
  const origin = url.origin;

  const [venus, yields] = await Promise.all([
    address && isAddress(address)
      ? fetch(`${origin}/api/venus?address=${address}`).then((r) => r.json())
      : Promise.resolve(null),
    fetch(`${origin}/api/yields`).then((r) => r.json()).catch(() => ({ pools: [] })),
  ]);

  const top = (yields.pools || [])[0];
  const atRisk = Boolean(venus?.atRisk);
  const idleVenus = !venus || venus.idle;

  const open: string[] = [];
  if (atRisk) open.push("health");
  if (top) open.push("yield");
  open.push("grid", "rebalance");

  return NextResponse.json({
    address: address || null,
    venus,
    yieldTop: top
      ? { project: top.project, symbol: top.symbol, apy: top.apy, tvlUsd: top.tvlUsd }
      : null,
    posture: atRisk ? "AT RISK" : idleVenus ? "IDLE" : "BUFFER",
    openCategories: atRisk ? ["health", "yield", "grid", "rebalance"] : ["yield", "grid", "rebalance", "health"],
    jobBlurb: atRisk
      ? `Venus shortfall ≈ $${Number(venus.shortfallUsdApprox).toFixed(2)}. Keep HF above 1.3. Do not take custody.`
      : top
        ? `Top live BSC stable pool: ${top.project} ${top.symbol} ${top.apy}% APY. Compare before moving 100 USDT.`
        : "No position heat. Browse only live offerings.",
  });
}
