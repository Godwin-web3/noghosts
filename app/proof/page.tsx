"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { SCAN } from "@/lib/config";
import { LAST_HIRE } from "@/lib/hire";

function ActivityInner() {
  const sp = useSearchParams();
  const tx = sp.get("tx");
  const chain = (Number(sp.get("chain") || 56) === 97 ? 97 : 56) as 56 | 97;
  const [job, setJob] = useState<any>(null);
  useEffect(() => {
    const raw = localStorage.getItem("noghosts:lastJob");
    if (raw) setJob(JSON.parse(raw));
  }, []);
  const hash = tx || job?.hash || LAST_HIRE.hash;
  return (
    <main className="page">
      <h1>Activity</h1>
      <p className="muted">Jobs posted from Berth. If there is no transaction, the hire did not happen.</p>
      <table>
        <tbody>
          <tr><th>Transaction</th><td className="mono">{hash}</td></tr>
          <tr><th>Network</th><td>BNB Chain</td></tr>
          <tr><th>Agent</th><td>{job?.agent || "—"}</td></tr>
          <tr><th>From</th><td className="mono">{job?.from || LAST_HIRE.from}</td></tr>
          <tr><th>Job</th><td>{job?.intent || "—"}</td></tr>
        </tbody>
      </table>
      <p>
        <a href={`${SCAN[chain]}/tx/${hash}`} target="_blank" rel="noreferrer">
          View on BscScan
        </a>
      </p>
      <p className="muted" style={{ marginTop: 24 }}>
        Latest confirmed hire:{" "}
        <a href={LAST_HIRE.explorer} target="_blank" rel="noreferrer">
          {LAST_HIRE.hash.slice(0, 10)}…{LAST_HIRE.hash.slice(-6)}
        </a>
      </p>
    </main>
  );
}

export default function ProofPage() {
  return (
    <Suspense fallback={<p className="muted">Loading…</p>}>
      <ActivityInner />
    </Suspense>
  );
}
