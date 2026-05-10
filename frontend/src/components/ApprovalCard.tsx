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
  const budgetMath = [
    { label: "Budget", value: formatPlannerUsd(proposedRun.payload.budget_usd) },
    { label: "Estimated spend", value: formatPlannerUsd(proposedRun.estimatedSpendUsd, 3) },
    { label: "Remaining if approved", value: formatPlannerUsd(proposedRun.estimatedRemainingUsd) },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 14, scale: 0.99 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.99 }}
      transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
      className="overflow-hidden rounded-[2rem] border border-[#F0B28C]/28 bg-[#FFF8F2] text-[#241C19] shadow-[0_30px_90px_rgba(20,12,10,0.36)]"
    >
      <div className="relative overflow-hidden border-b border-[#241C19]/10 bg-[linear-gradient(145deg,#FFF8F2,#F3DDCF)] p-5">
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#241C19]/12 bg-white/45 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-[#7D4035]">
              <LockKeyhole className="h-3.5 w-3.5 text-[#FF5848]" />
              Human approval required
            </div>
            <h3 className="text-[clamp(1.75rem,3vw,2.75rem)] font-semibold leading-[0.98] tracking-[-0.055em] text-[#241C19]">
              Tab agent wants approval
            </h3>
            <p className="mt-3 max-w-md text-sm leading-6 text-[#4B332D]/72">
              Approve this paid tool plan before the agent runs.
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-[#241C19]/10 bg-[#241C19] p-4 text-right text-[#FFF8F2] shadow-[0_18px_48px_rgba(36,28,25,0.22)] sm:min-w-[176px]">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#FFF8F2]/48">Amount</p>
            <p className="mt-1 font-mono text-4xl font-black tracking-[-0.05em]">
              Up to {formatPlannerUsd(proposedRun.estimatedSpendUsd, 3)}
            </p>
            <p className="mt-1 text-[11px] font-bold text-[#FFB39E]">{statusCopy(status)}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 p-5 xl:grid-cols-[1fr_0.78fr]">
        <div className="space-y-3">
          <div className="rounded-[1.25rem] border border-[#241C19]/10 bg-white/48 p-4">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#7D4035]/62">Purpose</p>
            <p className="mt-2 text-sm leading-6 text-[#241C19]/78">{proposedRun.payload.goal}</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-[1.25rem] border border-[#241C19]/10 bg-white/48 p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#7D4035]/62">Tool plan</p>
              <div className="mt-3 space-y-2">
                {proposedRun.tools.map((tool) => (
                  <div key={tool.id} className="flex items-center justify-between gap-3 rounded-xl bg-[#241C19]/6 px-3 py-2 text-xs">
                    <span className="font-mono font-bold text-[#241C19]/76">{tool.label}</span>
                    <span className="font-mono font-black text-[#A46A00]">{formatPlannerUsd(tool.priceUsd, 3)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[1.25rem] border border-[#241C19]/10 bg-white/48 p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#7D4035]/62">Budget impact</p>
              <dl className="mt-3 space-y-2 text-xs">
                {budgetMath.map((item) => (
                  <div key={item.label} className="flex justify-between gap-3">
                    <dt className="text-[#241C19]/52">{item.label}</dt>
                    <dd className="font-mono font-black text-[#241C19]">{item.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-[1.25rem] border border-[#0E4A43]/14 bg-[#0E4A43]/8 p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#0E4A43]">Policy</p>
              <p className="mt-2 text-sm font-bold text-[#241C19]">Human approval required</p>
              {proposedRun.warnings.map((warning) => (
                <p key={warning} className="mt-2 text-xs leading-5 text-[#8A5B00]">{warning}</p>
              ))}
            </div>
            <div className="rounded-[1.25rem] border border-[#241C19]/10 bg-white/48 p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#7D4035]/62">Token / asset</p>
              <p className="mt-2 break-all font-mono text-[11px] leading-5 text-[#241C19]/70">{proposedRun.payload.token}</p>
              <p className="mt-3 text-[10px] font-black uppercase tracking-[0.16em] text-[#7D4035]/62">Request ID</p>
              <p className="mt-1 font-mono text-xs font-bold text-[#241C19]">{proposedRun.id}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-4 rounded-[1.5rem] border border-[#241C19]/10 bg-[#241C19] p-4 text-[#FFF8F2]">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#FFB39E]">Spend control</p>
            <p className="mt-3 text-sm leading-6 text-[#FFF8F2]/76">
              Declining stops the run before any paid call executes. Receipts are only written for approved calls.
            </p>
            {status === "declined" && (
              <p className="mt-3 rounded-2xl border border-red-400/24 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-100">
                No paid call executed. No receipt created.
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={onInspect}
              className="group inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#FFF8F2]/18 bg-[#FFF8F2]/8 px-4 text-sm font-semibold text-[#FFF8F2] transition hover:border-[#FF5848]/48 hover:bg-[#FFF8F2]/12 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5848]/60"
            >
              <FileJson className="h-4 w-4 text-[#FFB39E]" />
              Inspect
              <ChevronDown className={`h-4 w-4 transition-transform ${inspectOpen ? "rotate-180" : ""}`} />
            </button>
            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
              <button
                type="button"
                onClick={onDecline}
                disabled={disabled}
                className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-red-400/22 bg-red-500/10 px-4 text-sm font-semibold text-red-100 transition hover:border-red-400/40 hover:bg-red-500/14 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/50 disabled:cursor-not-allowed disabled:opacity-45"
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
            transition={{ duration: 0.24, ease: "easeOut" }}
            className="overflow-hidden border-t border-[#241C19]/10 bg-[#241C19]"
          >
            <div className="grid gap-4 p-5 text-[#FFF8F2] lg:grid-cols-[1fr_0.82fr]">
              <div className="rounded-[1.25rem] border border-[#FFF8F2]/10 bg-[#100C0B]/60 p-4">
                <p className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#FFB39E]">
                  <FileJson className="h-3.5 w-3.5" />
                  Request payload JSON
                </p>
                <pre className="overflow-x-auto whitespace-pre-wrap break-words font-mono text-[11px] leading-5 text-[#FFF8F2]/70">
                  {payloadJson}
                </pre>
              </div>

              <div className="space-y-3">
                <div className="rounded-[1.25rem] border border-[#FFF8F2]/10 bg-[#FFF8F2]/7 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#FFF8F2]/46">Tool prices</p>
                  <div className="mt-3 space-y-2">
                    {proposedRun.tools.map((tool) => (
                      <div key={tool.id} className="flex items-center justify-between gap-3 text-xs">
                        <span className="text-[#FFF8F2]/64">{tool.label}</span>
                        <span className="font-mono font-bold text-amber-300">{formatPlannerUsd(tool.priceUsd, 3)}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-[1.25rem] border border-[#FFF8F2]/10 bg-[#FFF8F2]/7 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#FFF8F2]/46">Budget math</p>
                  <div className="mt-3 space-y-2">
                    {budgetMath.map((item) => (
                      <div key={item.label} className="flex items-center justify-between gap-3 text-xs">
                        <span className="text-[#FFF8F2]/64">{item.label}</span>
                        <span className="font-mono font-bold text-[#FFF8F2]">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-[1.25rem] border border-[#FFF8F2]/10 bg-[#FFF8F2]/7 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#FFF8F2]/46">Policy explanation</p>
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
                <div className="rounded-[1.25rem] border border-[#0E4A43]/45 bg-[#0E4A43]/18 p-4">
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
