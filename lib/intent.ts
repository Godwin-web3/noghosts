export type Category = "health" | "yield" | "grid" | "monitor" | "pancake" | "other";

const RULES: { cat: Category; keys: string[] }[] = [
  { cat: "health", keys: ["hf", "health factor", "liquidation", "venus", "lista", "collateral", "borrow"] },
  { cat: "yield", keys: ["yield", "apy", "apr", "earn", "stable", "usdt", "usdc"] },
  { cat: "grid", keys: ["grid", "range", "mm", "market make"] },
  { cat: "pancake", keys: ["pancake", "cake", "v3", "lp", "liquidity"] },
  { cat: "monitor", keys: ["monitor", "watch", "alert", "price", "wallet"] },
];

export function classifyIntent(text: string): Category {
  const t = text.toLowerCase();
  let best: Category = "other";
  let score = 0;
  for (const rule of RULES) {
    const hits = rule.keys.filter((k) => t.includes(k)).length;
    if (hits > score) {
      score = hits;
      best = rule.cat;
    }
  }
  return best;
}

export function classifyAgent(name: string, description: string, protocols: string[]): Category {
  return classifyIntent(`${name} ${description} ${protocols.join(" ")}`);
}

export const INTENT_EXAMPLES = [
  "Protect my Venus position under 1.3 HF",
  "Find best stable yield for 100 USDT on BSC",
  "Watch my Pancake V3 LP range",
  "Run a grid on BNB/USDT without taking custody",
];
