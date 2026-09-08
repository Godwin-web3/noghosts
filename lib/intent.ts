export type Category = "health" | "yield" | "grid" | "rebalance" | "other";

export const CATEGORIES: { id: Exclude<Category, "other">; label: string; intent: string }[] = [
  { id: "health", label: "Health", intent: "Protect my Venus position under 1.3 HF. Do not take custody." },
  { id: "yield", label: "Yield", intent: "Find best stable yield for 100 USDT on BSC. Read only." },
  { id: "grid", label: "Range", intent: "Watch my Pancake V3 LP range. Do not take custody." },
  { id: "rebalance", label: "Rebalance", intent: "Rebalance Pancake LP without taking custody." },
];

const RULES: { cat: Category; keys: string[] }[] = [
  { cat: "health", keys: ["hf", "health factor", "liquidation", "venus", "lista", "collateral", "borrow"] },
  { cat: "yield", keys: ["yield", "apy", "apr", "earn", "stable", "usdt", "usdc"] },
  { cat: "grid", keys: ["grid", "range", "mm", "market make", "v3"] },
  { cat: "rebalance", keys: ["rebalance", "pancake", "cake", "lp", "liquidity"] },
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

export const INTENT_EXAMPLES = CATEGORIES.map((c) => c.intent);
