import { motion } from "framer-motion";
import type { TabRunResult } from "../lib/types";

interface FinalAnswerProps {
  result: TabRunResult;
}

export function FinalAnswer({ result }: FinalAnswerProps) {
  return (
    <motion.section
      id="answer"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card"
    >
      <div className="border-b border-slate-100 px-5 py-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-indigo-600">
          Close the Tab
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
            {result.status}
          </span>
          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            confidence: {result.confidence}
          </span>
        </div>
      </div>
      <div className="p-5">
        <p className="text-sm leading-7 text-slate-700">{result.finalAnswer}</p>
        <p className="mt-5 rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-xs leading-relaxed text-indigo-800">
          {result.hackathonScopeNote}
        </p>
      </div>
    </motion.section>
  );
}
