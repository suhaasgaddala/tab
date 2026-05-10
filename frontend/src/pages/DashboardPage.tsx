import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { AgentChat } from "../components/AgentChat";
import { BudgetMeter } from "../components/BudgetMeter";
import { FinalAnswer } from "../components/FinalAnswer";
import { GoalForm } from "../components/GoalForm";
import { PlanReveal } from "../components/PlanReveal";
import { RunSummary } from "../components/RunSummary";
import { SpendRequestCard } from "../components/SpendRequestCard";
import { TopNav } from "../components/TopNav";
import { useTabRun } from "../hooks/useTabRun";
import type { RunState, TabRunRequest, TabRunResult } from "../lib/types";

const LOADING_STAGES = [
  { step: 1, label: "Reading budget policy", detail: "Fetching enforcement rules for this session" },
  { step: 2, label: "Creating spend requests", detail: "Agent queuing paid-tool calls" },
  { step: 3, label: "Auto-approving policy-safe calls", detail: "Evaluating each request against allowlist" },
  { step: 4, label: "Writing receipts", detail: "Issuing cryptographic proofs via x402" },
  { step: 5, label: "Closing Tab", detail: "Compiling spend trace and final answer" },
];

function formatPayloadUsd(value: number) {
  return `$${value.toFixed(4).replace(/0+$/, "").replace(/\.$/, "")}`;
}

function StagedLoader() {
  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStage((s) => (s < LOADING_STAGES.length - 1 ? s + 1 : s));
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.section
      key="staged-loading"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      className="overflow-hidden rounded-[1.5rem] border border-[#FFF8F2]/12 bg-[#100C0B]/45"
    >
      <div className="flex items-center gap-3 border-b border-[#FFF8F2]/10 px-4 py-3">
        <motion.span
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="h-4 w-4 rounded-full border-2 border-[#FFF8F2]/18 border-t-[#FF5848]"
        />
        <div>
          <p className="text-sm font-bold text-[#FF5848]">Tab open - agent running</p>
          <p className="font-mono text-[10px] text-[#FFF8F2]/42">POST /v1/tab/run</p>
        </div>
      </div>

      <div className="divide-y divide-[#FFF8F2]/10">
        {LOADING_STAGES.map((stage, index) => {
          const done = index < activeStage;
          const active = index === activeStage;

          return (
            <motion.div
              key={stage.step}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: index > activeStage ? 0.38 : 1, x: 0 }}
              transition={{ delay: index * 0.04, duration: 0.25 }}
              className="flex items-center gap-3 px-4 py-3"
            >
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border font-mono text-[10px] font-bold ${
                  done
                    ? "border-[#FF5848]/35 bg-[#FF5848]/14 text-[#FFB39E]"
                    : active
                    ? "border-[#FF5848]/45 text-[#FF5848]"
                    : "border-[#FFF8F2]/12 text-[#FFF8F2]/34"
                }`}
              >
                {done ? "✓" : stage.step}
              </span>
              <div className="min-w-0 flex-1">
                <p className={`text-xs font-semibold ${active ? "text-[#FFF8F2]" : "text-[#FFF8F2]/56"}`}>
                  {stage.label}
                </p>
                {active && <p className="mt-0.5 font-mono text-[10px] text-[#FFF8F2]/42">{stage.detail}</p>}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}

function RequestPayloadCard({
  input,
  status,
}: {
  input: TabRunRequest;
  status: "loading" | "success" | "error" | "submitted";
}) {
  const statusLabel = {
    loading: "Awaiting response",
    success: "Response shown",
    error: "Request failed",
    submitted: "Latest submitted",
  }[status];

  return (
    <section className="rounded-[1.25rem] border border-[#FFF8F2]/10 bg-[#1E1917]/36 p-4">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#FF5848]">Request payload</p>
          <p className="mt-0.5 font-mono text-[10px] text-[#FFF8F2]/38">POST /v1/tab/run</p>
        </div>
        <span className="rounded-full border border-[#FFF8F2]/14 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-[#FFF8F2]/48">
          {statusLabel}
        </span>
      </div>

      <dl className="grid gap-2 text-xs">
        <div className="flex items-center justify-between gap-4">
          <dt className="text-[#FFF8F2]/44">budget_usd</dt>
          <dd className="font-mono font-bold text-amber-400">{input.budget_usd}</dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt className="text-[#FFF8F2]/44">max_tool_calls</dt>
          <dd className="font-mono font-bold text-[#FFF8F2]">{input.max_tool_calls}</dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt className="text-[#FFF8F2]/44">chain</dt>
          <dd className="font-mono font-bold text-[#FFF8F2]">{input.chain}</dd>
        </div>
        <div>
          <dt className="text-[#FFF8F2]/44">token</dt>
          <dd className="mt-1 break-all font-mono text-[11px] text-[#FFF8F2]/72">{input.token}</dd>
        </div>
        <div>
          <dt className="text-[#FFF8F2]/44">goal</dt>
          <dd className="mt-1 leading-relaxed text-[#FFF8F2]/72">{input.goal}</dd>
        </div>
      </dl>

      <p className="mt-4 border-t border-[#FFF8F2]/10 pt-3 text-xs leading-relaxed text-[#FFF8F2]/50">
        Opened with budget {formatPayloadUsd(input.budget_usd)} and max tool calls {input.max_tool_calls}.
      </p>
    </section>
  );
}

function RunWorkspacePanel({
  state,
  result,
  lastInput,
}: {
  state: RunState;
  result: TabRunResult | null;
  lastInput: TabRunRequest | null;
}) {
  return (
    <AnimatePresence mode="wait">
      {state.status === "loading" && <StagedLoader />}

      {state.status === "error" && (
        <motion.div
          key="error"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          className="rounded-[1.25rem] border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-300"
        >
          <span className="font-bold">Tab run failed: </span>
          {state.error}
        </motion.div>
      )}

      {result && (
        <motion.div
          key="result"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          className="space-y-4"
        >
          <div className="grid gap-3 md:grid-cols-2">
            <BudgetMeter
              startingBudgetUsd={result.startingBudgetUsd}
              totalSpentUsd={result.totalSpentUsd}
              remainingBudgetUsd={result.remainingBudgetUsd}
            />
            <RunSummary result={result} request={lastInput} />
          </div>

          {lastInput && <RequestPayloadCard input={lastInput} status="success" />}

          <PlanReveal plan={result.plan} />

          <section id="requests" className="space-y-3">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#FF5848]">Spend requests</p>
                <h2 className="mt-0.5 text-sm font-bold text-[#FFF8F2]">Policy check before every paid call</h2>
              </div>
              <span className="rounded-full border border-[#FFF8F2]/14 px-3 py-0.5 font-mono text-[10px] text-[#FFF8F2]/48">
                {result.spendRequests.length} evaluated
              </span>
            </div>
            <div className="grid gap-3">
              {result.spendRequests.map((request, index) => (
                <SpendRequestCard key={request.id} request={request} index={index} />
              ))}
            </div>
          </section>

          <FinalAnswer result={result} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function DashboardPage() {
  const { state, run, reset } = useTabRun();
  const [lastInput, setLastInput] = useState<TabRunRequest | null>(null);
  const workspaceRef = useRef<HTMLDivElement>(null);

  const handleRun = (input: TabRunRequest) => {
    setLastInput(input);
    run(input);
  };

  const handleReset = () => {
    reset();
    setLastInput(null);
    workspaceRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const result = state.status === "success" ? state.result : null;
  const isLoading = state.status === "loading";

  return (
    <div className="min-h-screen tab-premium-shell">
      <TopNav onNewRun={handleReset} />

      <main ref={workspaceRef} className="mx-auto max-w-[1680px] px-3 py-4 sm:px-5 lg:px-6 lg:py-5">
        <AgentChat
          runState={state}
          result={result}
          lastInput={lastInput}
          onApproveRun={handleRun}
          manualControls={<GoalForm isLoading={isLoading} onSubmit={handleRun} />}
          runPanel={<RunWorkspacePanel state={state} result={result} lastInput={lastInput} />}
        />
      </main>
    </div>
  );
}
