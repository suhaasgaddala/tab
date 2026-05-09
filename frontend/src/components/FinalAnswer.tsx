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
      className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-card"
    >
      <div className="border-b border-zinc-800 px-5 py-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-400">
          Close the Tab
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-zinc-700 bg-zinc-800 px-3 py-0.5 text-xs font-semibold text-zinc-300">
            {result.status.replace("_", " ")}
          </span>
          <span className="rounded-full border border-emerald-500/20 bg-emerald-500/8 px-3 py-0.5 text-xs font-semibold text-emerald-400">
            confidence: {result.confidence}
          </span>
        </div>
      </div>
      <div className="p-5">
        <p className="text-sm leading-7 text-zinc-300">{result.finalAnswer}</p>
        <p className="mt-5 rounded-xl border border-amber-500/10 bg-amber-500/5 px-4 py-3 font-mono text-xs leading-relaxed text-amber-700">
          {result.hackathonScopeNote}
        </p>
      </div>
    </motion.section>
  );
}
