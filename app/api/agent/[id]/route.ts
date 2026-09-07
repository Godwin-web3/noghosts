import { NextResponse } from "next/server";
import { fetchAgent, probeUrl, toLive } from "@/lib/scan";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const raw = await fetchAgent(id);
  const live = toLive(raw);
  const probes = await Promise.all(
    live.endpoints.slice(0, 3).map(async (e) => ({
      ...e,
      probe: await probeUrl(e.url),
    }))
  );
  const anyLive = probes.some((p) => p.probe.ok);
  if (anyLive) {
    live.health.live = true;
    live.health.status = "live";
    live.health.source = "probe";
    live.health.latencyMs = probes.find((p) => p.probe.ok)?.probe.ms ?? null;
  }
  return NextResponse.json({ agent: live, probes });
}
