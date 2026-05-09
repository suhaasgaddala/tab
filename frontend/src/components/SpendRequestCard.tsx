import { motion } from "framer-motion";
import type { SpendRequest } from "../lib/types";

const STATUS_STYLE: Record<SpendRequest["status"], string> = {
  pending: "border-slate-200 bg-slate-50 text-slate-600",
  "auto-approved": "border-emerald-200 bg-emerald-50 text-emerald-700",
  denied: "border-red-200 bg-red-50 text-red-700",
  skipped: "border-amber-200 bg-amber-50 text-amber-700"
};

interface SpendRequestCardProps {
  request: SpendRequest;
  index: number;
}

export function SpendRequestCard({ request, index }: SpendRequestCardProps) {
  const statusText = request.status === "auto-approved" ? "Auto-approved" : request.status;

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            Spend request #{index + 1}
          </p>
          <h3 className="mt-1 text-base font-bold text-slate-950">{request.tool}</h3>
        </div>
        <span className={`rounded-full border px-3 py-1 text-[11px] font-bold capitalize ${STATUS_STYLE[request.status]}`}>
          {statusText}
        </span>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-3 text-xs">
        <div>
          <dt className="text-slate-400">Amount</dt>
          <dd className="mt-1 font-mono text-sm font-bold text-amber-700">${request.amountUsd.toFixed(3)}</dd>
        </div>
        <div>
          <dt className="text-slate-400">Category</dt>
          <dd className="mt-1 font-medium text-slate-700">{request.category}</dd>
        </div>
      </dl>

      <p className="mt-4 text-sm leading-relaxed text-slate-600">{request.reason}</p>
      <p className="mt-3 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-xs text-slate-500">
        Policy: {request.policyExplanation ?? request.policyResult ?? "pending"}
      </p>
    </motion.article>
  );
}
