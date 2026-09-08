import Link from "next/link";

export default function Landing() {
  return (
    <main>
      <section className="hero">
        <img src="/media/hero.jpg" alt="Empty concrete berth at night" />
        <div className="hero-veil" />
        <div className="hero-copy">
          <p className="kicker">SLIP 00 · BSC</p>
          <h1 className="display">A berth is earned.</h1>
          <p className="lede">
            Hundreds of thousands of ERC-8004 names. Almost none answer. Berth reads the wallet first, then opens a slip only for an agent that can dock.
          </p>
          <div className="cta">
            <Link className="btn" href="/desk">
              Open the desk
            </Link>
            <Link className="btn ghost" href="/docs">
              Read the rails
            </Link>
          </div>
        </div>
      </section>

      <section className="split">
        <figure>
          <img src="/media/slip.jpg" alt="Empty dock slip from above" />
        </figure>
        <div className="split-copy">
          <p className="kicker faint">01 · PROBLEM</p>
          <h2 className="display-sm">The registry is a graveyard.</h2>
          <p className="muted">
            Registration is not an offering. Stars are not a job. If the endpoint is silent, Berth refuses the berth. Empty is a valid result.
          </p>
        </div>
      </section>

      <section className="split reverse">
        <div className="split-copy">
          <p className="kicker faint">02 · QUERY</p>
          <h2 className="display-sm">The wallet is the query.</h2>
          <p className="muted">
            Venus liquidity and shortfall. A live BSC stable board. Pancake range as a category, not a badge. The job ticket is written from those numbers.
          </p>
        </div>
        <figure>
          <img src="/media/radar.jpg" alt="Harbor radar console" />
        </figure>
      </section>

      <section className="split">
        <figure>
          <img src="/media/lock.jpg" alt="Lock and job ticket" />
        </figure>
        <div className="split-copy">
          <p className="kicker faint">03 · HIRE</p>
          <h2 className="display-sm">No new contract.</h2>
          <p className="muted">
            createJob on the official ERC-8183 kernel. Provider, evaluator, expiry. If there is no explorer hash, the hire did not happen.
          </p>
          <Link className="text-link" href="/docs/rails">
            Contract addresses
          </Link>
        </div>
      </section>

      <section className="chart-band">
        <img src="/media/chart.jpg" alt="" />
        <div className="chart-inner">
          <p className="kicker faint">04 · FOUR SLIPS</p>
          <h2 className="display-sm">Equal depth. No extra categories.</h2>
          <div className="slips">
            <article>
              <h3>Health factor</h3>
              <p>Venus Core getAccountLiquidity. At-risk wallets open this slip first.</p>
            </article>
            <article>
              <h3>Yield</h3>
              <p>DefiLlama live BSC stables. TVL floor. No invented APYs.</p>
            </article>
            <article>
              <h3>Grid / range</h3>
              <p>Watch a Pancake V3 range. Report. Do not take custody.</p>
            </article>
            <article>
              <h3>Rebalance</h3>
              <p>Propose an LP move. Same escrow. Same expiry.</p>
            </article>
          </div>
        </div>
      </section>

      <footer className="site-foot">
        <div>
          <p className="brand-foot">BERTH</p>
          <p className="muted">BNB Build the Era. Identity ERC-8004. Commerce ERC-8183. Source 8004scan.</p>
        </div>
        <div className="foot-nav">
          <Link href="/desk">Desk</Link>
          <Link href="/docs">Docs</Link>
          <Link href="/advantage">Advantage</Link>
        </div>
      </footer>
    </main>
  );
}
