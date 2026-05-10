import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import type { TabRunResult } from "../lib/types";

const CONFIDENCE_META: Record<
  TabRunResult["confidence"],
  { color: string; border: string; bg: string; dot: string; title: string; explanation: string }
> = {
  high: {
    color: "text-green-400",
    border: "border-green-500/30",
    bg: "bg-green-500/8",
    dot: "bg-green-400",
    title: "High confidence",
    explanation:
      "Both market-signal and model-call were approved and executed. " +
      "Tab purchased live market data and the inference model synthesized it into a full report. " +
      "The spend trace is complete and both receipts were recorded.",
  },
  medium: {
    color: "text-amber-400",
    border: "border-amber-500/30",
    bg: "bg-amber-500/8",
    dot: "bg-amber-400",
    title: "Medium confidence",
    explanation:
      "Market data was purchased and a receipt was recorded, but the inference step was skipped " +
      "because the remaining budget fell below the model-call price ($0.001). " +
      "The analysis is based on raw market data without model synthesis. " +
      "Increase the budget by at least $0.001 to enable the full inference pass.",
  },
  low: {
    color: "text-red-400",
    border: "border-red-500/30",
    bg: "bg-red-500/5",
    dot: "bg-red-400",
    title: "Low confidence",
    explanation:
      "Tab could not purchase market-signal data because the budget was below the tool price ($0.020). " +
      "Since no market-data receipt was created, the model-call was also skipped — " +
      "there is nothing to synthesize. No spend occurred and no receipts were issued. " +
      "Set a budget of at least $0.021 to enable both tool calls.",
  },
};

interface RunSummaryProps {
  result: TabRunResult;
}

export function RunSummary({ result }: RunSummaryProps) {
  const [open, setOpen] = useState(false);
  const meta = CONFIDENCE_META[result.confidence];

  const stats = [
    { label: "Agent",          value: result.agent },
    { label: "Spend requests", value: String(result.spendRequests.length) },
    { label: "Receipts",       value: String(result.receipts.length) },
    { label: "Total spent",    value: `$${result.totalSpentUsd.toFixed(3)}` },
  ];

  return (
    <section className="rounded-2xl border border-slate-700 bg-slate-800 shadow-card overflow-hidden">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 px-4 pt-4 mb-4">Run trace</p>

      <div className="space-y-3 px-4">
        {stats.map((stat) => (
          <div key={stat.label} className="flex items-center justify-between gap-4">
            <span className="text-xs text-slate-500">{stat.label}</span>
            <span className="font-mono text-xs font-bold text-slate-200">{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Confidence row — clickable */}
      <div className="px-4 pt-3 pb-4">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center justify-between gap-3 cursor-pointer group"
        >
          <span className="text-xs text-slate-500">Confidence</span>
          <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest transition-opacity group-hover:opacity-80 ${meta.border} ${meta.bg} ${meta.color}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
            {result.confidence}
            <svg
              className={`h-3 w-3 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
              fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              key="confidence-detail"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="overflow-hidden"
            >
              <div className={`mt-3 rounded-xl border p-3 ${meta.border} ${meta.bg}`}>
                <p className={`text-[10px] font-bold uppercase tracking-widest mb-1.5 ${meta.color}`}>
                  {meta.title}
                </p>
                <p className="text-[11px] leading-relaxed text-slate-400">
                  {meta.explanation}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
