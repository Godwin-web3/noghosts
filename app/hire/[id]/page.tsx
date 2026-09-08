"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { encodeFunctionData } from "viem";
import { COMMERCE, COMMERCE_ABI, EVALUATOR, PAYMENT_TOKEN, SCAN } from "@/lib/config";

const ZERO = "0x0000000000000000000000000000000000000000";

export default function HirePage() {
  const { id } = useParams<{ id: string }>();
  const intent = useSearchParams().get("intent") || "Protect my Venus position under 1.3 HF";
  const [agent, setAgent] = useState<any>(null);
  const [chain, setChain] = useState<56 | 97>(56);
  const [hours, setHours] = useState(1);
  const [budget, setBudget] = useState("0.1");
  const [cap, setCap] = useState("50");
  const [account, setAccount] = useState("");
  const [err, setErr] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetch(`/api/agent/${id}`).then((r) => r.json()).then((j) => setAgent(j.agent)).catch((e) => setErr(String(e)));
  }, [id]);

  const calldata = useMemo(() => {
    if (!agent) return "";
    const expiredAt = BigInt(Math.floor(Date.now() / 1000) + hours * 3600);
    return encodeFunctionData({
      abi: COMMERCE_ABI,
      functionName: "createJob",
      args: [agent.wallet as `0x${string}`, EVALUATOR[chain], expiredAt, intent.slice(0, 500), ZERO],
    });
  }, [agent, chain, hours, intent]);

  async function connect() {
    const eth = (window as any).ethereum;
    if (!eth) throw new Error("No injected wallet");
    const accs = await eth.request({ method: "eth_requestAccounts" });
    setAccount(accs[0]);
    return accs[0];
  }

  async function sendCreate() {
    setErr("");
    try {
      const eth = (window as any).ethereum;
      const from = account || (await connect());
      setStatus("Sending createJob to AgenticCommerce…");
      const hash = await eth.request({
        method: "eth_sendTransaction",
        params: [{ from, to: COMMERCE[chain], data: calldata, value: "0x0" }],
      });
      localStorage.setItem("noghosts:lastJob", JSON.stringify({
        hash, chain, agent: id, provider: agent.wallet, intent, budget, cap, hours,
        commerce: COMMERCE[chain], token: PAYMENT_TOKEN[chain], at: Date.now(),
      }));
      window.location.href = `/proof?tx=${hash}&chain=${chain}`;
    } catch (e) {
      setErr(String(e));
      setStatus("");
    }
  }

  if (!agent) return <p className="muted page">Loading agent {id}…</p>;

  return (
    <main className="page">
      <p className="badge live">ERC-8183 CREATEJOB</p>
      <h1>Hire {agent.name}</h1>
      <p className="muted">Confirm in your wallet sends createJob on the official AgenticCommerce kernel. Not a simulated checkout.</p>
      <p>Intent: {intent}</p>
      <p className="mono">provider {agent.wallet}</p>
      <p className="mono">commerce {COMMERCE[chain]}</p>
      <p className="mono">evaluator {EVALUATOR[chain]}</p>
      <p className="mono">payment token {PAYMENT_TOKEN[chain]}</p>
      <label>Chain
        <select value={chain} onChange={(e) => setChain(Number(e.target.value) as 56 | 97)}>
          <option value={56}>BSC mainnet 56</option>
          <option value={97}>BSC testnet 97</option>
        </select>
      </label>
      <label>Escrow expiry hours
        <input type="number" min={1} value={hours} onChange={(e) => setHours(Number(e.target.value))} />
      </label>
      <label>Budget $U display
        <input value={budget} onChange={(e) => setBudget(e.target.value)} />
      </label>
      <label>Session spend cap display
        <input value={cap} onChange={(e) => setCap(e.target.value)} />
      </label>
      <p className="warn">Switch the wallet to the selected chain before sending. Session cap UI is policy. On-chain revoke needs an Altana session grant.</p>
      <div className="row" style={{ marginTop: 16 }}>
        <button className="btn ghost" onClick={() => connect().catch((e) => setErr(String(e)))}>{account ? account.slice(0, 8) : "Connect"}</button>
        <button className="btn" onClick={sendCreate}>Send createJob</button>
      </div>
      {status && <p>{status}</p>}
      {err && <p className="err">{err}</p>}
      <p className="muted"><a href={`${SCAN[chain]}/address/${COMMERCE[chain]}`} target="_blank">Kernel on explorer</a></p>
      <p className="muted" style={{ marginTop: 16 }}><a href="/desk">Back to desk</a></p>
    </main>
  );
}
