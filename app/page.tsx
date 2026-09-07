"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CATEGORIES } from "@/lib/intent";

type Agent = {
  id: string;
  tokenId: string;
  name: string;
  description: string;
  protocols: string[];
  x402: boolean;
  endpoints: { kind: string; url: string }[];
  health: { live: boolean; score: number | null; status: string; latencyMs: number | null };
  receipts: { score: number; feedbacks: number; stars: number };
};

export default function Home() {
  const [q, setQ] = useState(CATEGORIES[0].intent);
  const [cat, setCat] = useState(CATEGORIES[0].id);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<null | { category: string; scanned: number; ghostsDropped: number; agents: Agent[] }>(null);
  const [err, setErr] = useState("");
  const [wallet, setWallet] = useState("");
  const [desk, setDesk] = useState<any>(null);

  async function search(text = q) {
    setLoading(true);
    setErr("");
    try {
      const res = await fetch(`/api/agents?q=${encodeURIComponent(text)}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "search failed");
      setData(json);
    } catch (e) {
      setErr(String(e));
    } finally {
      setLoading(false);
    }
  }

  async function loadDesk(address?: string) {
    const res = await fetch(`/api/desk${address ? `?address=${address}` : ""}`);
    const json = await res.json();
    setDesk(json);
    if (json.atRisk || json.posture === "AT RISK") {
      const intent = CATEGORIES.find((c) => c.id === "health")!.intent;
      setQ(intent);
      setCat("health");
      search(intent);
    }
  }

  async function connect() {
    const eth = (window as unknown as { ethereum?: { request: (a: { method: string }) => Promise<string[]> } }).ethereum;
    if (!eth) {
      setErr("No injected wallet.");
      return;
    }
    const accs = await eth.request({ method: "eth_requestAccounts" });
    setWallet(accs[0]);
    await loadDesk(accs[0]);
  }

  useEffect(() => {
    loadDesk();
    search(CATEGORIES[0].intent);
  }, []);

  const live = (data?.agents || []).filter((a) => a.health.live);
  const shown = live.length ? live : data?.agents || [];

  return (
    <main>
      <section className="hero">
        <div>
          <p className="kicker">THE WALLET IS THE QUERY</p>
          <h1>Open the position. Only then hire.</h1>
          <p className="lede">
            Berth does not start with 300,000 names. It reads Venus, a live BSC yield board, and only then opens a category.
            Dead endpoints do not get a berth.
          </p>
          <div className="search">
            <input value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === "Enter" && search()} />
            <button onClick={() => search()}>{loading ? "Reading…" : "Find berth"}</button>
          </div>
          <div className="temps">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                className={cat === c.id ? "on" : ""}
                onClick={() => {
                  setCat(c.id);
                  setQ(c.intent);
                  search(c.intent);
                }}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
        <aside className="census">
          <h3>DESK</h3>
          <div className="metric"><span>Posture</span><b>{desk?.posture ?? "—"}</b></div>
          <div className="metric"><span>Venus buffer</span><b>{desk?.venus ? desk.venus.liquidityUsdApprox.toFixed(2) : "connect"}</b></div>
          <div className="metric"><span>Shortfall</span><b>{desk?.venus ? desk.venus.shortfallUsdApprox.toFixed(2) : "—"}</b></div>
          <div className="metric">
            <span>Top BSC stable</span>
            <b>{desk?.yieldTop ? `${desk.yieldTop.apy}%` : "—"}</b>
          </div>
          <div className="metric"><span>Refused this pass</span><b>{data?.ghostsDropped ?? "—"}</b></div>
          <p className="muted" style={{ marginTop: 14 }}>{desk?.jobBlurb}</p>
        </aside>
      </section>

      <div className="toolbar">
        <button className="btn" onClick={connect}>
          {wallet ? `${wallet.slice(0, 6)}…${wallet.slice(-4)}` : "Connect wallet · open desk"}
        </button>
        <span className="muted mono">four categories · live first · stars ignored</span>
      </div>

      {err && <p className="err">{err}</p>}

      {!live.length && data && (
        <div className="panel">
          <p>No offering answered this pass. Empty is the result. Ghosts stay off the dock.</p>
        </div>
      )}

      <div className="slips">
        {shown.slice(0, 4).map((a) => (
          <article className="slip" key={a.id}>
            <div className="slip-id">#{a.tokenId}</div>
            <div>
              <div className={a.health.live ? "status live" : "status dead"}>{a.health.live ? "DOCKED" : "AT SEA"}</div>
              <h2>{a.name}</h2>
              <p>{a.description || "No description on the registration file."}</p>
              <div className="meta">
                SLA unstated · price quoted at hire · receipts {a.receipts.score} · stars {a.receipts.stars} ignored
              </div>
              <div className="meta">{a.endpoints[0]?.url || "endpoint missing"}</div>
            </div>
            <div className="actions">
              <Link href={`/agent/${a.tokenId}`} className="muted">Evidence</Link>
              <Link className="btn" href={`/hire/${a.tokenId}?intent=${encodeURIComponent(desk?.jobBlurb || q)}`}>Hire</Link>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
