import { motion } from "framer-motion";
import type { SpendRequest } from "../lib/types";

const STATUS_STYLE: Record<SpendRequest["status"], { card: string; badge: string }> = {
  pending:        { card: "border-zinc-800 bg-zinc-900",           badge: "border-amber-500/20  bg-amber-500/8  text-amber-400"  },
  "auto-approved":{ card: "border-emerald-500/15 bg-zinc-900",     badge: "border-emerald-500/20 bg-emerald-500/8 text-emerald-400" },
  denied:         { card: "border-red-500/15 bg-zinc-900",         badge: "border-red-500/20    bg-red-500/8    text-red-400"    },
  skipped:        { card: "border-zinc-800 bg-zinc-900",           badge: "border-zinc-700      bg-zinc-800     text-zinc-400"   },
};

interface SpendRequestCardProps {
  request: SpendRequest;
  index: number;
}

export function SpendRequestCard({ request, index }: SpendRequestCardProps) {
  const style = STATUS_STYLE[request.status];
  const statusText = request.status === "auto-approved" ? "Auto-approved" : request.status;

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className={`rounded-2xl border p-4 shadow-card ${style.card}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600">
            Spend request #{index + 1}
          </p>
          <h3 className="mt-1 font-mono text-sm font-bold text-zinc-100">{request.tool}</h3>
        </div>
        <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest ${style.badge}`}>
          {statusText}
        </span>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-3 text-xs">
        <div>
          <dt className="text-zinc-600">Amount</dt>
          <dd className="mt-0.5 font-mono text-sm font-bold text-amber-400">${request.amountUsd.toFixed(3)}</dd>
        </div>
        <div>
          <dt className="text-zinc-600">Category</dt>
          <dd className="mt-0.5 font-medium text-zinc-300">{request.category}</dd>
        </div>
      </dl>

      <p className="mt-3 text-xs leading-relaxed text-zinc-400">{request.reason}</p>

      <p className="mt-3 rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 font-mono text-[11px] text-zinc-600">
        {request.policyExplanation ?? request.policyResult ?? "pending"}
      </p>
    </motion.article>
  );
}
