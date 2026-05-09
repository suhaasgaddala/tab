import type { TabRunResult } from "../lib/types";

interface RunSummaryProps {
  result: TabRunResult;
}

export function RunSummary({ result }: RunSummaryProps) {
  const stats = [
    { label: "Agent",          value: result.agent },
    { label: "Spend requests", value: String(result.spendRequests.length) },
    { label: "Receipts",       value: String(result.receipts.length) },
    { label: "Total spent",    value: `$${result.totalSpentUsd.toFixed(3)}` },
  ];

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 shadow-card">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600 mb-4">Run trace</p>
      <div className="space-y-3">
        {stats.map((stat) => (
          <div key={stat.label} className="flex items-center justify-between gap-4">
            <span className="text-xs text-zinc-500">{stat.label}</span>
            <span className="font-mono text-xs font-bold text-zinc-200">{stat.value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
