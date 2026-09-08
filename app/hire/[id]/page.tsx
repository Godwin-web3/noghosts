"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { encodeFunctionData } from "viem";
import { COMMERCE, COMMERCE_ABI, EVALUATOR, PAYMENT_TOKEN, SCAN } from "@/lib/config";

const CHAIN_HEX: Record<56 | 97, string> = { 56: "0x38", 97: "0x61" };

export default function HirePage() {
  const { id } = useParams<{ id: string }>();
  const intent = useSearchParams().get("intent") || "Protect my Venus position under 1.3 HF";
  const [agent, setAgent] = useState<any>(null);
  const [chain, setChain] = useState<56 | 97>(56);
  const [hours, setHours] = useState(2);
  const [budget, setBudget] = useState("0.1");
  const [cap, setCap] = useState("50");
  const [account, setAccount] = useState("");
  const [err, setErr] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetch(`/api/agent/${id}`).then((r) => r.json()).then((j) => setAgent(j.agent)).catch((e) => setErr(String(e)));
  }, [id]);

  const router = EVALUATOR[chain];
  const calldata = useMemo(() => {
    if (!agent?.wallet) return "";
    const expiredAt = BigInt(Math.floor(Date.now() / 1000) + Math.max(hours, 1) * 3600);
    return encodeFunctionData({
      abi: COMMERCE_ABI,
      functionName: "createJob",
      args: [agent.wallet as `0x${string}`, router, expiredAt, intent.slice(0, 500), router],
    });
  }, [agent, router, hours, intent]);

  async function ethereum() {
    const eth = (window as any).ethereum;
    if (!eth) throw new Error("No wallet in this browser. Open this page inside OKX Wallet.");
    return eth;
  }

  async function switchChain(eth: any, next: 56 | 97) {
    try {
      await eth.request({ method: "wallet_switchEthereumChain", params: [{ chainId: CHAIN_HEX[next] }] });
    } catch (e: any) {
      if (e?.code === 4902) {
        await eth.request({
          method: "wallet_addEthereumChain",
          params: [
            next === 97
              ? {
                  chainId: "0x61",
                  chainName: "BNB Smart Chain Testnet",
                  nativeCurrency: { name: "tBNB", symbol: "tBNB", decimals: 18 },
                  rpcUrls: ["https://bsc-testnet-dataseed.bnbchain.org"],
                  blockExplorerUrls: ["https://testnet.bscscan.com"],
                }
              : {
                  chainId: "0x38",
                  chainName: "BNB Smart Chain",
                  nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
                  rpcUrls: ["https://bsc-dataseed.binance.org"],
                  blockExplorerUrls: ["https://bscscan.com"],
                },
          ],
        });
      } else {
        throw e;
      }
    }
  }

  async function connect() {
    const eth = await ethereum();
    const accs = await eth.request({ method: "eth_requestAccounts" });
    setAccount(accs[0]);
    await switchChain(eth, chain);
    return accs[0];
  }

  async function sendCreate() {
    setErr("");
    try {
      const eth = await ethereum();
      const from = account || (await connect());
      await switchChain(eth, chain);
      if (!calldata) throw new Error("Agent wallet missing. Pick another row.");
      setStatus("Asking the wallet to create the job…");
      const hash = await eth.request({
        method: "eth_sendTransaction",
        params: [{ from, to: COMMERCE[chain], data: calldata, value: "0x0" }],
      });
      localStorage.setItem(
        "noghosts:lastJob",
        JSON.stringify({
          hash,
          chain,
          agent: id,
          provider: agent.wallet,
          intent,
          budget,
          cap,
          hours,
          commerce: COMMERCE[chain],
          token: PAYMENT_TOKEN[chain],
          at: Date.now(),
        })
      );
      window.location.href = `/proof?tx=${hash}&chain=${chain}`;
    } catch (e: any) {
      const msg = String(e?.message || e);
      if (msg.includes("4001") || e?.code === 4001) setErr("You rejected it in OKX. Tap Confirm hire again.");
      else if (/insufficient|bnb/i.test(msg)) setErr("This wallet needs a little BNB for gas. Switch the chain dropdown to BSC testnet 97 if you have tBNB.");
      else setErr(msg);
      setStatus("");
    }
  }

  if (!agent) return <p className="muted page">Loading agent {id}…</p>;

  return (
    <main className="page">
      <h1>Hire {agent.name}</h1>
      <p className="muted">
        This is the actual hire. Confirm in OKX sends createJob on BNB’s official job contract. You are not depositing money yet — that is a later step. You only pay a tiny gas fee in BNB.
      </p>
      <p>Job: {intent}</p>
      <p className="mono">agent {agent.wallet}</p>
      <p className="mono">job contract {COMMERCE[chain]}</p>
      <p className="mono">evaluator + hook {router}</p>
      <label>
        Chain
        <select value={chain} onChange={(e) => setChain(Number(e.target.value) as 56 | 97)}>
          <option value={56}>BSC mainnet — needs real BNB</option>
          <option value={97}>BSC testnet — use this if you have tBNB</option>
        </select>
      </label>
      <label>
        Job expires in hours
        <input type="number" min={1} value={hours} onChange={(e) => setHours(Number(e.target.value))} />
      </label>
      <label>
        Budget $U (shown only — not sent yet)
        <input value={budget} onChange={(e) => setBudget(e.target.value)} />
      </label>
      <label>
        Session spend cap (shown only)
        <input value={cap} onChange={(e) => setCap(e.target.value)} />
      </label>
      <p className="warn">
        If OKX says “contract execution error”, do not panic — that was the old zero-hook bug. Confirm should estimate a fee now. You need a little BNB on the selected chain.
      </p>
      <div className="row" style={{ marginTop: 16, display: "flex", gap: 8 }}>
        <button className="btn ghost" onClick={() => connect().catch((e) => setErr(String(e?.message || e)))}>
          {account ? account.slice(0, 8) : "Connect"}
        </button>
        <button className="btn" onClick={sendCreate}>
          Confirm hire
        </button>
      </div>
      {status && <p>{status}</p>}
      {err && <p className="err">{err}</p>}
      <p className="muted">
        <a href={`${SCAN[chain]}/address/${COMMERCE[chain]}`} target="_blank">
          Job contract on explorer
        </a>
      </p>
      <p className="muted" style={{ marginTop: 16 }}>
        <a href="/desk">Back to desk</a>
      </p>
    </main>
  );
}
