import { motion } from "framer-motion";
import { Check, Circle, ClipboardCheck, FileClock } from "lucide-react";

export type LifecycleState =
  | "idle"
  | "message"
  | "planned"
  | "requested"
  | "waiting"
  | "inspected"
  | "approved"
  | "declined"
  | "running"
  | "receipts"
  | "closed"
  | "error";

const lifecycleSteps = [
  { id: "message", label: "Message received" },
  { id: "planned", label: "Plan created" },
  { id: "requested", label: "Spend request created" },
  { id: "waiting", label: "Waiting for approval" },
  { id: "approved", label: "Approved / Declined" },
  { id: "running", label: "Running Tab" },
  { id: "receipts", label: "Receipts written" },
  { id: "closed", label: "Tab closed" },
] as const;

const stepRank: Record<LifecycleState, number> = {
  idle: 0,
  message: 1,
  planned: 2,
  requested: 3,
  waiting: 4,
  inspected: 4,
  approved: 5,
  declined: 5,
  running: 6,
  receipts: 7,
  closed: 8,
  error: 5,
};

interface ChatAuditTrailProps {
  lifecycleState: LifecycleState;
  auditEvents: string[];
}

export function ChatAuditTrail({ lifecycleState, auditEvents }: ChatAuditTrailProps) {
  const activeRank = stepRank[lifecycleState];
  const declined = lifecycleState === "declined";

  return (
    <section className="grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
      <div className="rounded-2xl border border-[#FFF8F2]/10 bg-[#1E1917]/34 p-4">
        <div className="mb-4 flex items-center gap-2">
          <FileClock className="h-4 w-4 text-[#FF5848]" />
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#FFF8F2]/48">Lifecycle</p>
        </div>
        <div className="grid gap-2 sm:grid-cols-4">
          {lifecycleSteps.map((step, index) => {
            const rank = index + 1;
            const active = activeRank >= rank;
            const terminalDecline = declined && step.id === "approved";

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.035 }}
                className={`rounded-2xl border px-3 py-3 transition ${
                  active
                    ? terminalDecline
                      ? "border-red-400/24 bg-red-500/9 text-red-100"
                      : "border-[#FF5848]/28 bg-[#FF5848]/10 text-[#FFF8F2]"
                    : "border-[#FFF8F2]/8 bg-[#FFF8F2]/4 text-[#FFF8F2]/32"
                }`}
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold">{String(rank).padStart(2, "0")}</span>
                  {active ? <Check className="h-3.5 w-3.5" /> : <Circle className="h-3.5 w-3.5" />}
                </div>
                <p className="text-[11px] font-semibold leading-4">{step.label}</p>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl border border-[#FFF8F2]/10 bg-[#1E1917]/34 p-4">
        <div className="mb-4 flex items-center gap-2">
          <ClipboardCheck className="h-4 w-4 text-[#FF5848]" />
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#FFF8F2]/48">Local audit trail</p>
        </div>
        {auditEvents.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-[#FFF8F2]/12 px-4 py-5 text-xs leading-5 text-[#FFF8F2]/36">
            No approval events yet. Start a chat to create a local audit trail.
          </p>
        ) : (
          <div className="space-y-2">
            {auditEvents.map((event, index) => (
              <motion.div
                key={`${event}-${index}`}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.22 }}
                className="flex items-start gap-3 rounded-xl border border-[#FFF8F2]/8 bg-[#FFF8F2]/5 px-3 py-2.5"
              >
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#FF5848]" />
                <p className="text-xs leading-5 text-[#FFF8F2]/58">{event}</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
