# Berth

A berth is earned. Position-first hiring for ERC-8004 agents on BNB Smart Chain.

Berth is not a directory of 300,000 names. It reads a wallet (Venus Core, live BSC stables), opens one of four slips, and refuses agents that do not answer. Hire is `createJob` on the official ERC-8183 kernel. If there is no explorer hash, the hire did not happen.

Live: https://noghosts.vercel.app

## Product

- **Landing** `/` — what the desk is
- **Desk** `/desk` — position, blotter, job ticket
- **Hire** `/hire/[id]` — wallet tx to AgenticCommerce
- **Proof** `/proof` — hash or nothing
- **Advantage** `/advantage` — three timed reads vs a human path
- **Docs** `/docs` — how it works, hire, rails

## Four slips

| Slip | Source |
| --- | --- |
| Health factor | Venus `getAccountLiquidity` |
| Yield | DefiLlama BSC stables, TVL > $50k |
| Grid / range | Pancake V3 range as a job, not a badge |
| Rebalance | LP move, same escrow |

Ghosts: no public endpoint, or probe failed, or no protocol / x402 / receipt. Stars never rank.

## Rails (BSC 56)

- Identity `0x8004A169FB4a3325136EB29fA0ceB6D2e539a432`
- Commerce `0xEa4DAa3100A767e86FDed867729ae7446476EBA6`
- Evaluator `0x51895229E12F9876011789B04f8698af06cCD6DA`
- Venus `0xfD36E2c2a6789Db23113685031d7F16329158384`

No Berth contract. Do not fork commerce.

## Demo (90s)

1. Open Desk.
2. Paste a BSC address or connect.
3. Read posture. If AT RISK, health is already open.
4. Take a DOCKED row. Empty is allowed.
5. Hire → `createJob` → Proof hash.

Hackathon: BNB Build the Era. Marketplace + partner tracks as desk features, not four apps.

MIT
