import { classifyAgent, type Category } from "./intent";

export const SCAN_API = "https://api.8004scan.io/api/v1";

export type RawAgent = {
  token_id: string;
  chain_id: number;
  name: string;
  description: string;
  owner_address: string;
  agent_wallet?: string | null;
  contract_address: string;
  supported_protocols: string[];
  x402_supported: boolean;
  total_score: number;
  health_score: number | null;
  star_count: number;
  total_feedbacks: number;
  created_at: string;
  created_tx_hash?: string;
  image_url?: string;
  services?: Record<string, { endpoint?: string } | null>;
  health_status?: {
    overall_status?: string;
    health_score?: number;
    services?: Record<string, { status?: string; endpoint?: string; latency_ms?: number; message?: string }>;
  };
};

export type LiveAgent = {
  id: string;
  tokenId: string;
  chainId: number;
  name: string;
  description: string;
  owner: string;
  wallet: string;
  registry: string;
  protocols: string[];
  x402: boolean;
  category: Category;
  endpoints: { kind: string; url: string }[];
  health: {
    live: boolean;
    score: number | null;
    status: string;
    latencyMs: number | null;
    source: "8004scan" | "probe";
  };
  receipts: { score: number; feedbacks: number; stars: number };
  createdAt: string;
  createdTx?: string;
  image?: string;
};

function endpointsOf(raw: RawAgent) {
  const out: { kind: string; url: string }[] = [];
  const services = raw.services || {};
  for (const [kind, val] of Object.entries(services)) {
    const url = val && typeof val === "object" ? val.endpoint : undefined;
    if (url && /^https?:\/\//i.test(url)) out.push({ kind, url });
  }
  return out;
}

export function toLive(raw: RawAgent, probe?: { ok: boolean; ms: number | null }): LiveAgent {
  const endpoints = endpointsOf(raw);
  const hs = raw.health_status;
  const serviceOk = Object.values(hs?.services || {}).some((s) => s?.status === "healthy");
  const live = Boolean(probe?.ok || serviceOk || (raw.health_score && raw.health_score >= 50 && endpoints.length));
  return {
    id: `${raw.chain_id}:${raw.token_id}`,
    tokenId: String(raw.token_id),
    chainId: raw.chain_id,
    name: raw.name || `Agent #${raw.token_id}`,
    description: raw.description || "",
    owner: raw.owner_address,
    wallet: raw.agent_wallet || raw.owner_address,
    registry: raw.contract_address,
    protocols: raw.supported_protocols || [],
    x402: Boolean(raw.x402_supported),
    category: classifyAgent(raw.name || "", raw.description || "", raw.supported_protocols || []),
    endpoints,
    health: {
      live,
      score: raw.health_score ?? hs?.health_score ?? null,
      status: live ? "live" : hs?.overall_status || "ghost",
      latencyMs: probe?.ms ?? null,
      source: probe ? "probe" : "8004scan",
    },
    receipts: {
      score: raw.total_score || 0,
      feedbacks: raw.total_feedbacks || 0,
      stars: raw.star_count || 0,
    },
    createdAt: raw.created_at,
    createdTx: raw.created_tx_hash,
    image: raw.image_url,
  };
}

export function isNoGhost(agent: LiveAgent): boolean {
  if (!agent.endpoints.length) return false;
  if (!agent.health.live) return false;
  const paid = agent.x402 || agent.receipts.score > 0 || agent.receipts.feedbacks > 0;
  const protocol = agent.protocols.length > 0;
  return paid || protocol;
}

export async function fetchAgents(limit = 80): Promise<RawAgent[]> {
  const url = `${SCAN_API}/agents?chain_id=56&limit=${limit}&offset=0`;
  const res = await fetch(url, { headers: { Accept: "application/json" }, next: { revalidate: 60 } });
  if (!res.ok) throw new Error(`8004scan ${res.status}`);
  const data = await res.json();
  return (data.items || data.data || []) as RawAgent[];
}

export async function fetchAgent(tokenId: string): Promise<RawAgent> {
  const res = await fetch(`${SCAN_API}/agents/56/${tokenId}`, {
    headers: { Accept: "application/json" },
    next: { revalidate: 30 },
  });
  if (!res.ok) throw new Error(`agent ${tokenId} ${res.status}`);
  return (await res.json()) as RawAgent;
}

export function rank(agents: LiveAgent[], category: Category): LiveAgent[] {
  const scored = agents.map((a) => {
    let s = 0;
    if (a.health.live) s += 50;
    if (a.endpoints.length) s += 10;
    if (a.x402) s += 8;
    if (a.protocols.length) s += 6;
    s += Math.min(20, a.receipts.score);
    s += Math.min(10, a.receipts.feedbacks);
    if (category !== "other" && a.category === category) s += 25;
    if (a.health.latencyMs != null) s += Math.max(0, 10 - Math.floor(a.health.latencyMs / 200));
    return { a, s };
  });
  scored.sort((x, y) => y.s - x.s);
  return scored.map((x) => x.a);
}

const PRIVATE = /^(localhost|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[0-1])\.|0\.|\[::)/i;

export async function probeUrl(url: string, ms = 4000): Promise<{ ok: boolean; status: number; ms: number }> {
  let host = "";
  try {
    host = new URL(url).hostname;
  } catch {
    return { ok: false, status: 0, ms: 0 };
  }
  if (PRIVATE.test(host)) return { ok: false, status: 0, ms: 0 };
  const t0 = Date.now();
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), ms);
  try {
    const res = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: ac.signal,
      headers: { Accept: "application/json, text/plain, */*" },
    });
    return { ok: res.status < 500, status: res.status, ms: Date.now() - t0 };
  } catch {
    return { ok: false, status: 0, ms: Date.now() - t0 };
  } finally {
    clearTimeout(timer);
  }
}
