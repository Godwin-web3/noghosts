"use client";

import { useEffect, useState } from "react";

export default function Advantage() {
  const [pools, setPools] = useState<any[] | null>(null);
  const [err, setErr] = useState("");
  const [ms, setMs] = useState<number | null>(null);
  useEffect(() => {
    const t0 = performance.now();
    fetch("/api/yields")
      .then(async (r) => {
        const j = await r.json();
        if (!r.ok) throw new Error(j.error);
        setPools(j.pools);
        setMs(Math.round(performance.now() - t0));
      })
      .catch((e) => setErr(String(e)));
  }, []);
  return (
    <main className="page">
      <p className="badge live">TERMIX · AGENT ADVANTAGE</p>
      <h1>100 USDT stable yield on BSC</h1>
      <p>Human path: DefiLlama, filter BSC, filter stable, sort APY. This path hits the same primary source once and ranks it.</p>
      <table>
        <thead><tr><th></th><th>Human</th><th>This path</th></tr></thead>
        <tbody>
          <tr><td>Time</td><td>3–8 min</td><td>{ms ? `${ms} ms` : "running"}</td></tr>
          <tr><td>Cost</td><td>attention</td><td>one public HTTP call</td></tr>
          <tr><td>Quality</td><td>depends who remembers TVL floors</td><td>TVL &gt; $50k, stablecoin flag</td></tr>
          <tr><td>Custody</td><td>none</td><td>none. Hire is a separate escrow.</td></tr>
        </tbody>
      </table>
      {err && <p className="err">{err}</p>}
      <h2>Live pools</h2>
      <table>
        <thead><tr><th>project</th><th>symbol</th><th>APY</th><th>TVL</th></tr></thead>
        <tbody>
          {(pools || []).map((p) => (
            <tr key={p.pool || p.project + p.symbol}>
              <td>{p.project}</td><td>{p.symbol}</td><td>{p.apy}%</td><td>${p.tvlUsd.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="muted">Source: yields.llama.fi. If Llama is down this page says so.</p>
    </main>
  );
}
