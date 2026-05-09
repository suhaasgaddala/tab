import type { TabRunResult } from "../lib/types";

interface RunSummaryProps {
  result: TabRunResult;
}

export function RunSummary({ result }: RunSummaryProps) {
  const stats = [
    { label: "Agent", value: result.agent },
    { label: "Spend requests", value: String(result.spendRequests.length) },
    { label: "Receipts", value: String(result.receipts.length) },
    { label: "Total spent", value: `$${result.totalSpentUsd.toFixed(3)}` }
  ];

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Run trace</p>
      <div className="mt-4 space-y-3">
        {stats.map((stat) => (
          <div key={stat.label} className="flex items-center justify-between gap-4">
            <span className="text-xs text-slate-500">{stat.label}</span>
            <span className="font-mono text-xs font-bold text-slate-900">{stat.value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
