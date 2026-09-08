"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { SCAN } from "@/lib/config";

function ProofInner() {
  const sp = useSearchParams();
  const tx = sp.get("tx");
  const chain = (Number(sp.get("chain") || 56) === 97 ? 97 : 56) as 56 | 97;
  const [job, setJob] = useState<any>(null);
  useEffect(() => {
    const raw = localStorage.getItem("noghosts:lastJob");
    if (raw) setJob(JSON.parse(raw));
  }, []);
  return (
    <main className="page">
      <p className="badge live">JUDGE LANDING</p>
      <h1>Proof</h1>
      <p>Every hire that left this product writes a tx hash. If there is no hash, the hire did not happen.</p>
      <table>
        <tbody>
          <tr><th>tx</th><td className="mono">{tx || job?.hash || "none yet"}</td></tr>
          <tr><th>chain</th><td>{chain}</td></tr>
          <tr><th>agent</th><td>{job?.agent || "—"}</td></tr>
          <tr><th>provider</th><td className="mono">{job?.provider || "—"}</td></tr>
          <tr><th>commerce</th><td className="mono">{job?.commerce || "—"}</td></tr>
          <tr><th>intent</th><td>{job?.intent || "—"}</td></tr>
        </tbody>
      </table>
      {(tx || job?.hash) && (
        <p><a href={`${SCAN[chain]}/tx/${tx || job.hash}`} target="_blank">Open on explorer</a></p>
      )}
    </main>
  );
}

export default function ProofPage() {
  return (
    <Suspense fallback={<p className="muted">Loading proof…</p>}>
      <ProofInner />
    </Suspense>
  );
}
