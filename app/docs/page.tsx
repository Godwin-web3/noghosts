import Link from "next/link";
import { DocsNav } from "./nav";

export default function DocsHome() {
  return (
    <div className="docs">
      <DocsNav />
      <article className="docs-body">
        <p className="kicker faint">DOCS</p>
        <h1 className="display-sm">How Berth works</h1>
        <p className="muted">
          Berth is a desk, not a directory. It does not deploy a marketplace contract. It reads official BNB rails and refuses dead inventory.
        </p>
        <ol className="docs-ol">
          <li>
            <h2>1. Read the position</h2>
            <p>Connect a wallet or paste a BSC address. Venus Core returns liquidity and shortfall. DefiLlama returns live stable pools on BSC with TVL above $50k.</p>
          </li>
          <li>
            <h2>2. Classify the job</h2>
            <p>Four categories, equal depth: health factor, yield, grid/range, rebalance. At-risk Venus opens health first.</p>
          </li>
          <li>
            <h2>3. Filter ghosts</h2>
            <p>8004scan is the census. An offering needs a public endpoint and a live probe, plus a protocol, x402, or a receipt. Stars never rank.</p>
          </li>
          <li>
            <h2>4. Hire on the kernel</h2>
            <p>createJob(provider, evaluator, expiredAt, description, hook). Description is the desk blurb. Proof is the explorer hash.</p>
          </li>
        </ol>
        <p className="muted">Demo: open the desk, paste an address, take a DOCKED row, send createJob, land on Proof.</p>
        <Link className="btn" href="/desk" style={{ display: "inline-flex", alignItems: "center", marginTop: 24 }}>
          Open the desk
        </Link>
      </article>
    </div>
  );
}
