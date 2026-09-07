import { NextResponse } from "next/server";
import { createPublicClient, http, isAddress } from "viem";
import { bsc } from "viem/chains";
import { RPC, VENUS_ABI, VENUS_COMPTROLLER } from "@/lib/config";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const address = new URL(req.url).searchParams.get("address") || "";
  if (!isAddress(address)) {
    return NextResponse.json({ error: "need a BSC address" }, { status: 400 });
  }
  const client = createPublicClient({ chain: bsc, transport: http(RPC[56]) });
  try {
    const [error, liquidity, shortfall] = (await client.readContract({
      address: VENUS_COMPTROLLER,
      abi: VENUS_ABI,
      functionName: "getAccountLiquidity",
      args: [address as `0x${string}`],
    })) as [bigint, bigint, bigint];

    const liq = Number(liquidity) / 1e18;
    const short = Number(shortfall) / 1e18;
    const atRisk = short > 0;
    const idle = error === 0n && liquidity === 0n && shortfall === 0n;

    return NextResponse.json({
      address,
      comptroller: VENUS_COMPTROLLER,
      error: error.toString(),
      liquidityUsdApprox: liq,
      shortfallUsdApprox: short,
      atRisk,
      idle,
      note: idle
        ? "No Venus liquidity or shortfall on this account. Either no borrow, or the position is not on Venus Core."
        : atRisk
          ? "Shortfall is non-zero. Liquidation path is open."
          : "Account has positive liquidity buffer on Venus Core.",
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 502 });
  }
}
