import { NextResponse } from "next/server";
import { classifyIntent } from "@/lib/intent";
import { fetchAgent, fetchAgents, isNoGhost, rank, toLive } from "@/lib/scan";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  const category = (searchParams.get("category") as ReturnType<typeof classifyIntent>) || classifyIntent(q);
  const raw = await fetchAgents(60);

  const withServices: typeof raw = [];
  const rest = [];
  for (const a of raw) {
    if ((a.supported_protocols && a.supported_protocols.length) || a.health_score) withServices.push(a);
    else rest.push(a);
  }

  const details = await Promise.all(
    withServices.slice(0, 12).map(async (a) => {
      try {
        return await fetchAgent(String(a.token_id));
      } catch {
        return a;
      }
    })
  );

  const live = [...details, ...rest.slice(0, 20)].map((a) => toLive(a));
  const filtered = live.filter(isNoGhost);
  const ranked = rank(filtered.length ? filtered : live.filter((a) => a.endpoints.length || a.x402), category).slice(0, 8);

  return NextResponse.json({
    query: q,
    category,
    scanned: raw.length,
    ghostsDropped: live.length - filtered.length,
    agents: ranked.length ? ranked : live.slice(0, 3).map((a) => ({ ...a, note: "thin live supply after No-Ghosts filter" })),
    filter: "endpoint + (live health or protocol or x402/receipt)",
    source: "https://api.8004scan.io/api/v1/agents?chain_id=56",
  });
}
