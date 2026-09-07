"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CATEGORIES, type Category } from "@/lib/intent";

type Agent = {
  id: string;
  tokenId: string;
  name: string;
  description: string;
  wallet: string;
  protocols: string[];
  x402: boolean;
  endpoints: { kind: string; url: string }[];
  health: { live: boolean };
  receipts: { score: number; stars: number };
};

export default function Desk() {
  const [cat, setCat] = useState<Exclude<Category, "other">>("health");
  const [q, setQ] = useState(CATEGORIES[0].intent);
  const [address, setAddress] = useState("");
  const [wallet, setWallet] = useState("");
  const [desk, setDesk] = useState<any>(null);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [scanned, setScanned] = useState(0);
  const [dropped, setDropped] = useState(0);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [picked, setPicked] = useState<Agent | null>(null);
  const intent = useMemo(() => desk?.jobBlurb || desk?.blurb || q, [desk, q]);

  async function refresh(nextQ = q, nextCat = cat) {
    setLoading(true);
    setErr("");
    try {
      const res = await fetch(`/api/agents?q=${encodeURIComponent(nextQ)}&category=${nextCat}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "search failed");
      setAgents(json.agents || []);
      setScanned(json.scanned || 0);
      setDropped(json.ghostsDropped || 0);
      const live = (json.agents || []).find((a: Agent) => a.health.live);
      setPicked(live || json.agents?.[0] || null);
    } catch (e) {
      setErr(String(e));
    } finally {
      setLoading(false);
    }
  }

  async function loadDesk(addr?: string) {
    const res = await fetch(`/api/desk${addr ? `?address=${addr}` : ""}`);
    const json = await res.json();
    setDesk(json);
    if (json.posture === "AT RISK") {
      setCat("health");
      setQ(CATEGORIES[0].intent);
      await refresh(CATEGORIES[0].intent, "health");
    }
  }

  async function connect() {
    const eth = (window as any).ethereum;
    if (!eth) {
      setErr("No injected wallet. Paste a BSC address instead.");
      return;
    }
    const accs = await eth.request({ method: "eth_requestAccounts" });
    setWallet(accs[0]);
    setAddress(accs[0]);
    await loadDesk(accs[0]);
  }

  useEffect(() => {
    loadDesk();
    refresh();
  }, []);

  const live = agents.filter((a) => a.health.live);
  const rows = live.length ? live : agents;

  return (
    <main className="desk">
      <aside className="rail">
        <p className="rail-h">POSITION</p>
        <div className="rail-b">
          <button className="btn" onClick={connect}>
            {wallet ? `${wallet.slice(0, 6)}…${wallet.slice(-4)}` : "Connect wallet"}
          </button>
          <label>
            OR PASTE ADDRESS
            <div className="addr">
              <input value={address} onChange={(e) => setAddress(e.target.value.trim())} placeholder="0x…" />
              <button onClick={() => address && loadDesk(address)}>Read</button>
            </div>
          </label>
          <div className="stat">
            <div className="row">
              <span className="muted">Posture</span>
              <b className={desk?.posture === "AT RISK" ? "tone-bad" : desk?.posture === "BUFFER" ? "tone-live" : ""}>
                {desk?.posture ?? "—"}
              </b>
            </div>
            <div className="row">
              <span className="muted">Venus buffer</span>
              <b>{desk?.venus ? `$${Number(desk.venus.liquidityUsdApprox).toFixed(2)}` : "—"}</b>
            </div>
            <div className="row">
              <span className="muted">Shortfall</span>
              <b>{desk?.venus ? `$${Number(desk.venus.shortfallUsdApprox).toFixed(2)}` : "—"}</b>
            </div>
            <div className="row">
              <span className="muted">BSC stable lead</span>
              <b>{desk?.yieldTop ? `${desk.yieldTop.apy}%` : "—"}</b>
            </div>
          </div>
          <p className="muted" style={{ fontSize: 12 }}>
            {intent || "Connect or paste an address. The desk stays quiet until there is a position."}
          </p>
        </div>
      </aside>
      <section style={{ display: "flex", flexDirection: "column", minHeight: 0 }}>
        <div className="tabs">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              className={cat === c.id ? "on" : ""}
              onClick={() => {
                setCat(c.id);
                setQ(c.intent);
                refresh(c.intent, c.id);
              }}
            >
              {c.label}
            </button>
          ))}
          <span className="census">scanned {scanned} · refused {dropped} · live {live.length}</span>
        </div>
        {err && <p className="err">{err}</p>}
        <div className="blotter">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>OFFERING</th>
                <th>STATUS</th>
                <th>SIGNAL</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={5} className="muted">Reading 8004scan…</td>
                </tr>
              )}
              {!loading && live.length === 0 && (
                <tr>
                  <td colSpan={5}>
                    <p>No berth this pass.</p>
                    <p className="muted">{dropped} registrations refused. Empty is the result.</p>
                  </td>
                </tr>
              )}
              {!loading &&
                rows.slice(0, 8).map((a) => (
                  <tr key={a.id} className="pick" onClick={() => setPicked(a)}>
                    <td className="mono faint">#{a.tokenId}</td>
                    <td>
                      <div>{a.name}</div>
                      <div className="muted" style={{ fontSize: 12 }}>{a.description || "No registration description."}</div>
                    </td>
                    <td>
                      <span className={a.health.live ? "live" : "dead"}>{a.health.live ? "DOCKED" : "AT SEA"}</span>
                    </td>
                    <td className="mono faint">{(a.protocols?.[0] || "—") + (a.x402 ? " · x402" : "")}</td>
                    <td style={{ textAlign: "right" }}>
                      <Link className="hire" href={`/hire/${a.tokenId}?intent=${encodeURIComponent(intent)}`} onClick={(e) => e.stopPropagation()}>
                        Hire
                      </Link>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>
      <aside className="ticket">
        <p className="rail-h">JOB TICKET</p>
        <div className="rail-b">
          {picked ? (
            <>
              <div>
                <p className="mono faint" style={{ fontSize: 10 }}>#{picked.tokenId}</p>
                <h2 style={{ margin: "4px 0 0", fontSize: 16, fontWeight: 500 }}>{picked.name}</h2>
              </div>
              <p className="muted" style={{ fontSize: 13 }}>{intent}</p>
              <div className="stat">
                <div className="row"><span className="muted">Provider</span><b>{picked.wallet ? `${picked.wallet.slice(0, 6)}…${picked.wallet.slice(-4)}` : "—"}</b></div>
                <div className="row"><span className="muted">Endpoint</span><b>{picked.endpoints?.[0]?.url?.replace(/^https?:\/\//, "") || "missing"}</b></div>
                <div className="row"><span className="muted">Stars</span><b>{picked.receipts.stars} ignored</b></div>
                <div className="row"><span className="muted">Receipts</span><b>{picked.receipts.score}</b></div>
              </div>
              <p className="muted" style={{ fontSize: 12 }}>
                Session cap and expiry are on the hire screen. createJob hits the official ERC-8183 kernel.
              </p>
              <Link className="btn" href={`/hire/${picked.tokenId}?intent=${encodeURIComponent(intent)}`} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                Open hire
              </Link>
              <Link href={`/agent/${picked.tokenId}`} className="muted" style={{ textAlign: "center", fontSize: 12 }}>
                Evidence
              </Link>
            </>
          ) : (
            <p className="muted">Select a row. The ticket fills from the desk, not from a blank form.</p>
          )}
        </div>
      </aside>
    </main>
  );
}
