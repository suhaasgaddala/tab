import { motion } from "framer-motion";
import type { PolicyResult, SpendRequest } from "../lib/types";

// ─── Status display ───────────────────────────────────────────────────────────
const STATUS_STYLE: Record<SpendRequest["status"], { border: string; badge: string; label: string }> = {
  pending:          { border: "border-amber-500/22",      badge: "border-amber-500/20 bg-amber-500/8 text-amber-400",     label: "Pending" },
  "auto-approved":  { border: "border-green-500/20",      badge: "border-green-500/20 bg-green-500/8 text-green-400",     label: "Approved" },
  denied:           { border: "border-red-500/20",        badge: "border-red-500/20 bg-red-500/8 text-red-400",           label: "Denied" },
  skipped:          { border: "border-[#FFF8F2]/18",      badge: "border-[#FFF8F2]/18 bg-[#FFF8F2]/8 text-[#FFF8F2]/58", label: "Skipped" },
};

// ─── Policy result display ────────────────────────────────────────────────────
const POLICY_META: Record<PolicyResult, { label: string; color: string }> = {
  approved:                  { label: "Budget passed · category allowed",                    color: "text-green-400" },
  blocked_category:          { label: "Blocked — category denied by policy",                 color: "text-red-400" },
  category_not_allowed:      { label: "Category not in allowed list",                        color: "text-red-400" },
  max_price_per_call_exceeded:{ label: "Price exceeds per-call limit",                       color: "text-red-400" },
  insufficient_budget:       { label: "Skipped — insufficient remaining budget",             color: "text-[#FFF8F2]/58" },
  max_tool_calls_exceeded:   { label: "Max tool calls reached",                              color: "text-[#FFF8F2]/58" },
  dependency_not_met:        { label: "Skipped — required market-signal was not approved",   color: "text-[#FFF8F2]/58" },
};

interface SpendRequestCardProps {
  request: SpendRequest;
  index: number;
}

export function SpendRequestCard({ request, index }: SpendRequestCardProps) {
  const style = STATUS_STYLE[request.status];
  const policy = request.policyResult ? POLICY_META[request.policyResult] : null;

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.09 }}
      className={`tab-card overflow-hidden rounded-2xl border ${style.border}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 px-4 py-3.5">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#FFF8F2]/36">
            Request #{index + 1}
          </p>
          <h3 className="mt-0.5 font-mono text-sm font-bold text-[#FFF8F2]">{request.tool}</h3>
        </div>
        <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest ${style.badge}`}>
          {style.label}
        </span>
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-2 gap-3 border-t border-[#FFF8F2]/10 px-4 py-3">
        <div>
          <p className="text-[10px] text-[#FFF8F2]/38">Amount</p>
          <p className="mt-0.5 font-mono text-base font-black text-amber-400">
            ${request.amountUsd.toFixed(3)}
          </p>
        </div>
        <div>
          <p className="text-[10px] text-[#FFF8F2]/38">Category</p>
          <p className="mt-0.5 text-xs font-semibold text-[#FFF8F2]/72">{request.category}</p>
        </div>
      </div>

      {/* Reason */}
      <div className="border-t border-[#FFF8F2]/10 px-4 py-3">
        <p className="mb-1 text-[10px] text-[#FFF8F2]/38">Agent reason</p>
        <p className="text-xs leading-relaxed text-[#FFF8F2]/60">{request.reason}</p>
      </div>

      {/* Policy verdict */}
      <div className="border-t border-[#FFF8F2]/10 px-4 py-3">
        <p className="mb-1.5 text-[10px] text-[#FFF8F2]/38">Policy verdict</p>
        {policy ? (
          <>
            <p className={`font-mono text-[11px] font-semibold ${policy.color}`}>
              {policy.label}
            </p>
            {request.policyExplanation && (
              <p className="mt-1 text-[11px] leading-relaxed text-[#FFF8F2]/42">
                {request.policyExplanation}
              </p>
            )}
          </>
        ) : (
          <p className="font-mono text-[11px] text-[#FFF8F2]/42">
            {request.policyExplanation ?? "pending evaluation"}
          </p>
        )}
      </div>
    </motion.article>
  );
}
