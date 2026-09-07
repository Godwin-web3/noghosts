"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { INTENT_EXAMPLES } from "@/lib/intent";

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
  const [q, setQ] = useState(INTENT_EXAMPLES[0]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<null | { category: string; scanned: number; ghostsDropped: number; agents: Agent[] }>(null);
  const [err, setErr] = useState("");
  const [wallet, setWallet] = useState("");
  const [venus, setVenus] = useState<null | { atRisk: boolean; idle: boolean; liquidityUsdApprox: number; shortfallUsdApprox: number; note: string }>(null);

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

  async function connect() {
    const eth = (window as unknown as { ethereum?: { request: (a: { method: string }) => Promise<string[]> } }).ethereum;
    if (!eth) {
      setErr("No injected wallet.");
      return;
    }
    const accs = await eth.request({ method: "eth_requestAccounts" });
    setWallet(accs[0]);
    const v = await fetch(`/api/venus?address=${accs[0]}`).then((r) => r.json());
    setVenus(v.error ? null : v);
  }

  useEffect(() => {
    search(INTENT_EXAMPLES[0]);
  }, []);

  return (
    <main>
      <p className="badge live">A BERTH IS EARNED</p>
      <h1>Type the job. Only what can dock.</h1>
      <p className="muted">
        Hundreds of thousands of ERC-8004 names on BSC. Most never answer.
        Berth only ranks agents with a live endpoint and a payment or protocol signal.
      </p>
      <div className="intent">
        <input value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === "Enter" && search()} />
        <button onClick={() => search()}>{loading ? "Reading registry…" : "Find berth"}</button>
      </div>
      <div className="chips">
        {INTENT_EXAMPLES.map((ex) => (
          <button key={ex} className={q === ex ? "on" : ""} onClick={() => { setQ(ex); search(ex); }}>
            {ex}
          </button>
        ))}
      </div>
      <div className="row">
        <button className="btn ghost" onClick={connect}>
          {wallet ? `${wallet.slice(0, 6)}…${wallet.slice(-4)}` : "Connect wallet · Venus mirror"}
        </button>
        {data && (
          <div className="muted">
            scanned {data.scanned} · refused berth {data.ghostsDropped} · category {data.category}
          </div>
        )}
      </div>
      {venus && (
        <div className="card" style={{ marginTop: 16 }}>
          <div className="row">
            <strong>Venus Core mirror</strong>
            <span className={venus.atRisk ? "badge dead" : "badge live"}>{venus.atRisk ? "AT RISK" : venus.idle ? "NO POSITION" : "BUFFER"}</span>
          </div>
          <p className="muted">{venus.note}</p>
          <p className="mono">liquidity ≈ ${venus.liquidityUsdApprox.toFixed(2)} · shortfall ≈ ${venus.shortfallUsdApprox.toFixed(2)}</p>
        </div>
      )}
      {err && <p className="err">{err}</p>}
      <div className="grid" style={{ marginTop: 20 }}>
        {(data?.agents || []).slice(0, 3).map((a) => (
          <article className="card" key={a.id}>
            <div className="row">
              <div>
                <div className={a.health.live ? "badge live" : "badge dead"}>{a.health.live ? "DOCKED" : "AT SEA"}</div>
                <h2 style={{ marginTop: 6 }}>{a.name}</h2>
              </div>
              <div className="muted">#{a.tokenId}</div>
            </div>
            <p>{a.description || "No description on the registration file."}</p>
            <p className="mono muted">
              {a.protocols.join(" · ") || "no protocol"} {a.x402 ? "· x402" : ""} · receipts {a.receipts.score} · stars {a.receipts.stars} ignored
            </p>
            <p className="mono muted">{a.endpoints[0]?.url || "endpoint missing"}</p>
            <div className="row">
              <Link href={`/agent/${a.tokenId}`}>Open evidence</Link>
              <Link className="btn" href={`/hire/${a.tokenId}?intent=${encodeURIComponent(q)}`}>Hire</Link>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
