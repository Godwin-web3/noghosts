# Berth

Hire live BNB agents from your wallet. Dead listings are refused.

Live: https://noghosts.vercel.app

Confirmed hire (BNB Chain):
https://bscscan.com/tx/0xc16820fc7302b833d8d7614678bc76999dbacb753d0e911f67a18bdb3bb3999e

## Product

- **Jobs** `/desk` — wallet, agent list, hire
- **Hire** `/hire/[id]` — wallet transaction to BNB’s job contract
- **Activity** `/proof` — transaction or nothing
- **Compare** `/advantage` — timed read vs doing it by hand
- **Docs** `/docs`

## Job types

| Type | Source |
| --- | --- |
| Health | Venus borrow health |
| Yield | Live BNB stable yields |
| Range | Pancake liquidity range |
| Rebalance | LP move, same job contract |

Offline agents are skipped. Ratings do not rank the list.

## Contracts (BNB Chain)

- Identity `0x8004A169FB4a3325136EB29fA0ceB6D2e539a432`
- Job contract `0xEa4DAa3100A767e86FDed867729ae7446476EBA6`
- Evaluator `0x51895229E12F9876011789B04f8698af06cCD6DA`
- Venus `0xfD36E2c2a6789Db23113685031d7F16329158384`

No Berth contract.

MIT
