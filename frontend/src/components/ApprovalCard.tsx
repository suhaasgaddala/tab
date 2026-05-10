import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, ChevronDown, FileJson, LockKeyhole, ShieldCheck, XCircle } from "lucide-react";
import { formatPlannerUsd, type ProposedTabRun } from "../lib/chatPlanner";

export type ApprovalStatus = "idle" | "pending" | "inspected" | "approved" | "declined" | "running" | "completed" | "error";

interface ApprovalCardProps {
  proposedRun: ProposedTabRun;
  status: ApprovalStatus;
  inspectOpen: boolean;
  isRunning: boolean;
  onInspect: () => void;
  onApprove: () => void;
  onDecline: () => void;
}

function statusCopy(status: ApprovalStatus) {
  if (status === "declined") return "Declined";
  if (status === "running") return "Running";
  if (status === "completed") return "Completed";
  if (status === "error") return "Needs review";
  if (status === "approved") return "Approved";
  if (status === "inspected") return "Inspected";
  return "Pending approval";
}

export function ApprovalCard({
  proposedRun,
  status,
  inspectOpen,
  isRunning,
  onInspect,
  onApprove,
  onDecline,
}: ApprovalCardProps) {
  const disabled = isRunning || status === "declined" || status === "running" || status === "completed";
  const payloadJson = JSON.stringify(proposedRun.payload, null, 2);

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
      className="overflow-hidden rounded-[1.75rem] border border-[#FF5848]/24 bg-[linear-gradient(145deg,rgba(255,88,72,0.16),rgba(255,248,242,0.075))] shadow-[0_28px_80px_rgba(20,12,10,0.28)]"
    >
      <div className="relative overflow-hidden border-b border-[#FFF8F2]/10 p-5 sm:p-6">
        <div className="pointer-events-none absolute right-[-90px] top-[-120px] h-64 w-64 rounded-full bg-[#FF5848]/18 blur-3xl" />
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#FFF8F2]/16 bg-[#FFF8F2]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#FFF8F2]/66">
              <LockKeyhole className="h-3.5 w-3.5 text-[#FF6A5D]" />
              Human approval required
            </div>
            <h3 className="text-2xl font-semibold tracking-[-0.05em] text-[#FFF8F2]">
              Tab agent wants approval to spend
            </h3>
            <p className="mt-2 max-w-xl text-sm leading-6 text-[#FFF8F2]/62">
              Approve this paid tool plan before the agent runs.
            </p>
          </div>

          <div className="rounded-2xl border border-[#FFF8F2]/12 bg-[#1E1917]/42 p-4 text-right">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#FFF8F2]/42">Amount</p>
            <p className="mt-1 font-mono text-3xl font-black tracking-[-0.04em] text-[#FFF8F2]">
              Up to {formatPlannerUsd(proposedRun.estimatedSpendUsd, 3)}
            </p>
            <p className="mt-1 text-[11px] font-semibold text-[#FFB39E]">{statusCopy(status)}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 p-5 sm:p-6 lg:grid-cols-[1fr_0.8fr]">
        <dl className="grid gap-3 text-xs sm:grid-cols-2">
          {[
            ["Requested by", "Tab agent"],
            ["Purpose", proposedRun.payload.goal],
            ["Tool", "market-signal + model-call"],
            ["Provider", "DexScreener + Anthropic via Tab router"],
            ["Budget", formatPlannerUsd(proposedRun.payload.budget_usd)],
            ["Max calls", String(proposedRun.payload.max_tool_calls)],
            ["Remaining if approved", formatPlannerUsd(proposedRun.estimatedRemainingUsd)],
            ["Token / asset", proposedRun.payload.token],
            ["Chain", "Base"],
            ["Policy", "Human approval required"],
            ["Request ID", proposedRun.id],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-[#FFF8F2]/10 bg-[#1E1917]/32 p-3">
              <dt className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#FFF8F2]/36">{label}</dt>
              <dd className="mt-1 break-words text-[#FFF8F2]/76">{value}</dd>
            </div>
          ))}
        </dl>

        <div className="flex flex-col justify-between gap-4 rounded-2xl border border-[#FFF8F2]/10 bg-[#FFF8F2]/7 p-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#FF5848]">Spend control</p>
            <p className="mt-3 text-sm leading-6 text-[#FFF8F2]/68">
              Tab does not just let agents pay. It lets humans control what agents are allowed to buy.
            </p>
            <p className="mt-3 text-xs leading-5 text-[#FFF8F2]/46">
              Declining stops the run before any paid call executes. Receipts are only written for approved calls.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={onInspect}
              className="group inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#FFF8F2]/16 bg-[#FFF8F2]/8 px-4 text-sm font-semibold text-[#FFF8F2] transition hover:border-[#FF5848]/48 hover:bg-[#FFF8F2]/12 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5848]/60"
            >
              <FileJson className="h-4 w-4 text-[#FFB39E]" />
              Inspect
              <ChevronDown className={`h-4 w-4 transition-transform ${inspectOpen ? "rotate-180" : ""}`} />
            </button>
            <div className="grid gap-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={onDecline}
                disabled={disabled}
                className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-red-400/20 bg-red-500/8 px-4 text-sm font-semibold text-red-200 transition hover:border-red-400/35 hover:bg-red-500/12 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/50 disabled:cursor-not-allowed disabled:opacity-45"
              >
                <XCircle className="h-4 w-4" />
                Decline
              </button>
              <button
                type="button"
                onClick={onApprove}
                disabled={disabled}
                className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#FF5848] px-4 text-sm font-semibold text-white shadow-[0_18px_42px_rgba(255,88,72,0.24)] transition hover:bg-[#F05A4A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFF8F2]/75 disabled:cursor-not-allowed disabled:opacity-45"
              >
                <CheckCircle2 className="h-4 w-4" />
                Approve and run
              </button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {inspectOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.26, ease: "easeOut" }}
            className="overflow-hidden border-t border-[#FFF8F2]/10"
          >
            <div className="grid gap-4 p-5 sm:p-6 lg:grid-cols-[1fr_0.82fr]">
              <div className="rounded-2xl border border-[#FFF8F2]/10 bg-[#100C0B]/58 p-4">
                <p className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#FF5848]">
                  <FileJson className="h-3.5 w-3.5" />
                  Exact request payload
                </p>
                <pre className="overflow-x-auto whitespace-pre-wrap break-words font-mono text-[11px] leading-5 text-[#FFF8F2]/70">
                  {payloadJson}
                </pre>
              </div>

              <div className="space-y-3">
                <div className="rounded-2xl border border-[#FFF8F2]/10 bg-[#1E1917]/42 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#FFF8F2]/40">Tool prices</p>
                  <div className="mt-3 space-y-2">
                    {proposedRun.tools.map((tool) => (
                      <div key={tool.id} className="flex items-center justify-between gap-3 text-xs">
                        <span className="text-[#FFF8F2]/62">{tool.label}</span>
                        <span className="font-mono font-bold text-amber-300">{formatPlannerUsd(tool.priceUsd, 3)}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-2xl border border-[#FFF8F2]/10 bg-[#1E1917]/42 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#FFF8F2]/40">Policy explanation</p>
                  <p className="mt-2 text-xs leading-5 text-[#FFF8F2]/62">
                    Human approval is required before execution. Budget checks still happen inside the existing Tab backend for every spend request.
                  </p>
                  {proposedRun.warnings.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {proposedRun.warnings.map((warning) => (
                        <p key={warning} className="flex gap-2 text-xs leading-5 text-amber-200">
                          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                          {warning}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
                <div className="rounded-2xl border border-[#0E4A43]/45 bg-[#0E4A43]/18 p-4">
                  <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#9BE3D6]">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Execution note
                  </p>
                  <p className="mt-2 text-xs leading-5 text-[#FFF8F2]/62">
                    This approval only runs Tab’s paid tool-call demo. It does not move card funds, book services, or initiate external merchant payments.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
