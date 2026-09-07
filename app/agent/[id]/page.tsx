"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function AgentPage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<any>(null);
  const [err, setErr] = useState("");
  useEffect(() => {
    fetch(`/api/agent/${id}`)
      .then(async (r) => {
        const j = await r.json();
        if (!r.ok) throw new Error(j.error || r.statusText);
        setData(j);
      })
      .catch((e) => setErr(String(e)));
  }, [id]);
  if (err) return <p className="err">{err}</p>;
  if (!data) return <p className="muted">Reading 8004scan + probing endpoint…</p>;
  const a = data.agent;
  return (
    <main>
      <p className={a.health.live ? "badge live" : "badge dead"}>{a.health.live ? "LIVE PROBE" : "FAILED PROBE"}</p>
      <h1>{a.name}</h1>
      <p>{a.description}</p>
      <p className="mono">owner {a.owner}</p>
      <p className="mono">wallet {a.wallet}</p>
      <p className="mono">registry {a.registry}</p>
      <p><a href={`https://bscscan.com/token/0x8004A169FB4a3325136EB29fA0ceB6D2e539a432?a=${a.tokenId}`} target="_blank">Registry token on BscScan</a></p>
      <h2>Endpoints we probed</h2>
      <table>
        <thead><tr><th>kind</th><th>url</th><th>status</th><th>ms</th></tr></thead>
        <tbody>
          {(data.probes || []).map((p: any) => (
            <tr key={p.url}>
              <td>{p.kind}</td>
              <td className="mono">{p.url}</td>
              <td>{p.probe.ok ? "up" : "down"} ({p.probe.status})</td>
              <td>{p.probe.ms}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>Stars {a.receipts.stars} are displayed and not used for rank.</p>
      <p className="badge mock">Identity and this probe are mainnet reads. createJob is real only after you sign.</p>
      <p><Link className="btn" href={`/hire/${a.tokenId}`}>Hire this agent</Link></p>
    </main>
  );
}
