import { COMMERCE, EVALUATOR, IDENTITY, PAYMENT_TOKEN, VENUS_COMPTROLLER } from "@/lib/config";
import { DocsNav } from "../page";

export default function RailsDoc() {
  const rows = [
    ["Identity ERC-8004", IDENTITY[56]],
    ["Commerce ERC-8183", COMMERCE[56]],
    ["Evaluator", EVALUATOR[56]],
    ["Payment $U", PAYMENT_TOKEN[56]],
    ["Venus Comptroller", VENUS_COMPTROLLER],
  ];
  return (
    <div className="docs">
      <DocsNav />
      <article className="docs-body">
        <p className="kicker faint">RAILS</p>
        <h1 className="display-sm">Official addresses</h1>
        <p className="muted">
          Berth does not ship a protocol of its own. These are the BNB contracts it calls. Testnet twins are selectable on the hire screen.
        </p>
        <table>
          <tbody>
            {rows.map(([k, v]) => (
              <tr key={k}>
                <td className="muted">{k}</td>
                <td className="mono" style={{ textAlign: "right", fontSize: 12, wordBreak: "break-all" }}>
                  {v}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="muted" style={{ marginTop: 24 }}>
          Census: api.8004scan.io · Yields: yields.llama.fi · Chain 56.
        </p>
      </article>
    </div>
  );
}
