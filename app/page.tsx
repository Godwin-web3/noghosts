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
      <section className="hero">
        <div>
          <p className="kicker">A BERTH IS EARNED</p>
          <h1>Type the job. Only what can dock.</h1>
          <p className="lede">
            Hundreds of thousands of ERC-8004 names on BSC. Most never answer.
            Berth ranks agents with a live endpoint and a payment or protocol signal.
          </p>
          <div className="search">
            <input value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === "Enter" && search()} />
            <button onClick={() => search()}>{loading ? "Reading…" : "Find berth"}</button>
          </div>
          <div className="temps">
            {INTENT_EXAMPLES.map((ex) => (
              <button key={ex} className={q === ex ? "on" : ""} onClick={() => { setQ(ex); search(ex); }}>
                {ex}
              </button>
            ))}
          </div>
        </div>
        <aside className="census">
          <h3>CENSUS · THIS PASS</h3>
          <div className="metric"><span>Scanned</span><b>{data?.scanned ?? "—"}</b></div>
          <div className="metric"><span>Refused berth</span><b>{data?.ghostsDropped ?? "—"}</b></div>
          <div className="metric"><span>Intent class</span><b>{data?.category ?? "—"}</b></div>
          <div className="metric"><span>Shown</span><b>{data?.agents?.length ?? 0}</b></div>
          <div className="metric"><span>Stars in rank</span><b>never</b></div>
        </aside>
      </section>
      <div className="toolbar">
        <button className="btn quiet" onClick={connect}>
          {wallet ? `${wallet.slice(0, 6)}…${wallet.slice(-4)}` : "Connect · Venus mirror"}
        </button>
        <span className="muted mono">source 8004scan · chain 56</span>
      </div>
      {venus && (
        <div className="panel">
          <div className="row">
            <strong>Venus Core</strong>
            <span className={venus.atRisk ? "status dead" : "status live"}>
              {venus.atRisk ? "AT RISK" : venus.idle ? "NO POSITION" : "BUFFER"}
            </span>
          </div>
          <p className="muted">{venus.note}</p>
          <p className="mono faint">liquidity {venus.liquidityUsdApprox.toFixed(2)} · shortfall {venus.shortfallUsdApprox.toFixed(2)}</p>
        </div>
      )}
      {err && <p className="err">{err}</p>}
      <div className="slips">
        {(data?.agents || []).slice(0, 3).map((a) => (
          <article className="slip" key={a.id}>
            <div className="slip-id">#{a.tokenId}</div>
            <div>
              <div className={a.health.live ? "status live" : "status dead"}>{a.health.live ? "DOCKED" : "AT SEA"}</div>
              <h2>{a.name}</h2>
              <p>{a.description || "No description on the registration file."}</p>
              <div className="meta">
                {(a.protocols.join(" · ") || "no protocol")}{a.x402 ? " · x402" : ""} · receipts {a.receipts.score} · stars {a.receipts.stars} ignored
              </div>
              <div className="meta">{a.endpoints[0]?.url || "endpoint missing"}</div>
            </div>
            <div className="actions">
              <Link href={`/agent/${a.tokenId}`} className="muted">Evidence</Link>
              <Link className="btn" href={`/hire/${a.tokenId}?intent=${encodeURIComponent(q)}`}>Hire</Link>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
