import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { BudgetMeter } from "../components/BudgetMeter";
import { FinalAnswer } from "../components/FinalAnswer";
import { GoalForm } from "../components/GoalForm";
import { PlanReveal } from "../components/PlanReveal";
import { ReceiptLedger } from "../components/ReceiptLedger";
import { RunSummary } from "../components/RunSummary";
import { SpendRequestCard } from "../components/SpendRequestCard";
import { TopNav } from "../components/TopNav";
import { useTabRun } from "../hooks/useTabRun";
import type { TabRunRequest } from "../lib/types";

// ─── Staged loading steps (visual-only) ──────────────────────────────────────
const LOADING_STAGES = [
  { step: 1, label: "Reading budget policy", detail: "Fetching enforcement rules for this session" },
  { step: 2, label: "Creating spend requests", detail: "Agent queuing paid-tool calls" },
  { step: 3, label: "Auto-approving policy-safe calls", detail: "Evaluating each request against allowlist" },
  { step: 4, label: "Writing receipts", detail: "Issuing cryptographic proofs via x402" },
  { step: 5, label: "Closing Tab", detail: "Compiling spend trace and final answer" },
];

function StagedLoader() {
  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStage((s) => (s < LOADING_STAGES.length - 1 ? s + 1 : s));
    }, 1400);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      key="staged-loading"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      className="overflow-hidden rounded-2xl border border-green-500/10 bg-slate-800/60"
    >
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-slate-700/60 px-5 py-4">
        <motion.span
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="h-4 w-4 rounded-full border-2 border-slate-600 border-t-green-400"
        />
        <div>
          <p className="text-sm font-bold text-green-400">Tab open — agent running</p>
          <p className="font-mono text-xs text-slate-500">
            POST /v1/tab/run · waiting for spend trace
          </p>
        </div>
      </div>

      {/* Steps */}
      <div className="divide-y divide-slate-700/40">
        {LOADING_STAGES.map((stage, i) => {
          const done = i < activeStage;
          const active = i === activeStage;
          const pending = i > activeStage;

          return (
            <motion.div
              key={stage.step}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: pending ? 0.35 : 1, x: 0 }}
              transition={{ delay: i * 0.06, duration: 0.3 }}
              className="flex items-center gap-4 px-5 py-3"
            >
              {/* Step indicator */}
              <div className="flex h-6 w-6 shrink-0 items-center justify-center">
                {done ? (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500/15 text-green-400"
                  >
                    <svg viewBox="0 0 16 16" fill="currentColor" className="h-3 w-3">
                      <path fillRule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" clipRule="evenodd" />
                    </svg>
                  </motion.span>
                ) : active ? (
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                    className="h-4 w-4 rounded-full border-2 border-slate-600 border-t-green-400"
                  />
                ) : (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full border border-slate-700 font-mono text-[9px] text-slate-600">
                    {stage.step}
                  </span>
                )}
              </div>

              {/* Label */}
              <div className="min-w-0 flex-1">
                <p className={`text-xs font-semibold ${done ? "text-slate-400" : active ? "text-slate-100" : "text-slate-600"}`}>
                  {stage.label}
                </p>
                {active && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-0.5 font-mono text-[10px] text-slate-500"
                  >
                    {stage.detail}
                  </motion.p>
                )}
              </div>

              {/* Timing */}
              {done && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="shrink-0 font-mono text-[9px] text-green-700"
                >
                  done
                </motion.span>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

// ─── Static tool catalog ──────────────────────────────────────────────────────
const TOOL_CATALOG = [
  {
    id: "market-signal",
    provider: "DexScreener",
    price: "$0.020",
    category: "market-data",
    status: "available" as const,
    decision: "Selected — within budget & policy",
    desc: "Real-time DEX liquidity data for token pairs on Base.",
  },
  {
    id: "model-call",
    provider: "Anthropic",
    price: "$0.001",
    category: "inference",
    status: "conditional" as const,
    decision: "Selected if remaining budget allows",
    desc: "Claude Haiku — fast synthesis and reasoning at minimal cost.",
  },
  {
    id: "trading-execution",
    provider: "External",
    price: "variable",
    category: "trading-execution",
    status: "blocked" as const,
    decision: "Blocked — category denied by policy",
    desc: "On-chain trade execution. Prevented by Tab policy for this run.",
  },
];

// ─── Static policy rules ──────────────────────────────────────────────────────
const POLICY_RULES = [
  { label: "Approval mode", value: "Auto (within budget)", type: "neutral" },
  { label: "Allowed categories", value: "market-data · inference", type: "allowed" },
  { label: "Blocked categories", value: "trading-execution", type: "blocked" },
  { label: "Budget check", value: "Before every spend request", type: "neutral" },
  { label: "Overspend protection", value: "Hard cap — no overruns", type: "allowed" },
  { label: "Payment rail", value: "x402 · base-sepolia", type: "neutral" },
];

// ─── Tool Catalog panel ───────────────────────────────────────────────────────
function ToolCatalogPanel() {
  const statusMeta = {
    available: {
      badge: "border-green-500/20 bg-green-500/8 text-green-400",
      label: "Available",
    },
    conditional: {
      badge: "border-amber-500/20 bg-amber-500/8 text-amber-400",
      label: "Conditional",
    },
    blocked: {
      badge: "border-red-500/20 bg-red-500/8 text-red-400",
      label: "Blocked",
    },
  };

  return (
    <section id="policy" className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-800">
      <div className="border-b border-slate-700 px-5 py-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
          Paid Tool Catalog
        </p>
        <p className="mt-0.5 text-sm font-bold text-slate-100">
          Tools available to this agent
        </p>
      </div>

      <div className="divide-y divide-slate-700/60">
        {TOOL_CATALOG.map((tool) => {
          const meta = statusMeta[tool.status];
          return (
            <div key={tool.id} className="px-5 py-4">
              <div className="mb-2 flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-mono text-sm font-bold text-slate-100">{tool.id}</p>
                  <p className="mt-0.5 text-[11px] text-slate-500">
                    {tool.provider} · {tool.category}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="font-mono text-sm font-bold text-amber-400">{tool.price}</p>
                  <span className={`mt-1 inline-flex rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest ${meta.badge}`}>
                    {meta.label}
                  </span>
                </div>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-600">{tool.desc}</p>
              <p className="mt-1.5 font-mono text-[10px] text-slate-700">→ {tool.decision}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ─── Policy Engine panel ──────────────────────────────────────────────────────
function PolicyEnginePanel() {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-800">
      <div className="border-b border-slate-700 px-5 py-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
          Policy Engine
        </p>
        <p className="mt-0.5 text-sm font-bold text-slate-100">
          Rules applied per spend request
        </p>
      </div>

      <div className="divide-y divide-slate-700/50 px-5">
        {POLICY_RULES.map((rule) => (
          <div key={rule.label} className="flex items-center justify-between gap-4 py-2.5">
            <span className="text-xs text-slate-500">{rule.label}</span>
            <span className={`font-mono text-[11px] font-semibold ${
              rule.type === "allowed"
                ? "text-green-400"
                : rule.type === "blocked"
                ? "text-red-400"
                : "text-slate-400"
            }`}>
              {rule.value}
            </span>
          </div>
        ))}
      </div>

      <div className="border-t border-slate-700 px-5 py-3">
        <p className="font-mono text-[10px] text-slate-700">
          Policy-controlled paid tool access for agents
        </p>
      </div>
    </section>
  );
}

// ─── Hero section ─────────────────────────────────────────────────────────────
function HeroSection({ onRunDemo }: { onRunDemo: () => void }) {
  return (
    <section className="relative overflow-hidden border-b border-slate-700/60 pb-14 pt-10">
      <div className="tab-grid absolute inset-0 opacity-25" />
      <div className="pointer-events-none absolute left-1/4 top-0 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-green-500/5 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-56 w-56 rounded-full bg-green-500/4 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        {/* Badges */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex flex-wrap gap-2"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
            Powered by x402 paid-tool backbone
          </span>
        </motion.div>

        <div className="grid items-end gap-10 lg:grid-cols-[1fr_auto]">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 }}
              className="font-mono text-5xl font-extrabold leading-[1.06] tracking-tight text-slate-50 sm:text-6xl lg:text-[4.5rem]"
            >
              The spend layer<br />
              for <span className="text-green-400">AI agents.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.13 }}
              className="mt-5 max-w-xl text-lg leading-relaxed text-slate-400"
            >
              Give agents controlled access to paid tools — with budgets,
              policy-based spend approval, and an auditable receipt trace
              for every call.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <button
                onClick={onRunDemo}
                className="inline-flex items-center gap-2 rounded-xl bg-green-500 px-6 py-3 text-sm font-bold text-slate-950 shadow-[0_0_24px_rgba(34,197,94,0.2)] transition-all hover:bg-green-400 hover:shadow-[0_0_36px_rgba(34,197,94,0.35)] cursor-pointer"
              >
                Run Agent Demo
                <svg viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5">
                  <path d="M3 3.732a1.5 1.5 0 0 1 2.305-1.265l6.706 4.267a1.5 1.5 0 0 1 0 2.531l-6.706 4.268A1.5 1.5 0 0 1 3 12.268V3.732Z" />
                </svg>
              </button>
              <a
                href="#answer"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-6 py-3 text-sm font-bold text-slate-400 transition-all hover:border-slate-500 hover:text-slate-200"
              >
                View Spend Trace
              </a>
            </motion.div>
          </div>

          {/* Right: quick-scan fact cards */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.28 }}
            className="hidden shrink-0 flex-col gap-2 lg:flex"
          >
            {[
              { step: "1", label: "Agent receives goal + budget" },
              { step: "2", label: "Tab inspects available paid tools" },
              { step: "3", label: "Spend requests evaluated by policy" },
              { step: "4", label: "Approved calls execute via x402" },
              { step: "5", label: "Receipts and trace returned" },
            ].map((item) => (
              <div
                key={item.step}
                className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-2.5"
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-green-500/20 bg-green-500/8 font-mono text-[10px] font-bold text-green-400">
                  {item.step}
                </span>
                <p className="text-xs text-slate-400">{item.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { state, run, reset } = useTabRun();
  const [lastInput, setLastInput] = useState<TabRunRequest | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const handleRun = (input: TabRunRequest) => {
    setLastInput(input);
    run(input);
  };

  const handleReset = () => {
    reset();
    setLastInput(null);
  };

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const result = state.status === "success" ? state.result : null;
  const isLoading = state.status === "loading";

  return (
    <div className="min-h-screen bg-slate-900">
      <TopNav onNewRun={handleReset} />

      <HeroSection onRunDemo={scrollToForm} />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:grid lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-6">
        {/* ── Left column ── */}
        <div className="space-y-5" ref={formRef} id="goal">
          <GoalForm isLoading={isLoading} onSubmit={handleRun} />

          <AnimatePresence mode="wait">
            {isLoading && <StagedLoader />}

            {state.status === "error" && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="rounded-2xl border border-red-500/20 bg-red-500/5 px-5 py-4 text-sm text-red-400"
              >
                <span className="font-bold">Tab run failed: </span>
                {state.error}
              </motion.div>
            )}

            {result && (
              <motion.div
                key="result"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-5"
              >
                <PlanReveal plan={result.plan} />

                <section id="requests" className="space-y-3">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-green-400">
                        Spend Requests
                      </p>
                      <h2 className="mt-0.5 text-base font-bold text-slate-50">
                        Policy check before every paid call
                      </h2>
                    </div>
                    <span className="rounded-full border border-slate-700 px-3 py-0.5 font-mono text-[10px] text-slate-500">
                      {result.spendRequests.length} evaluated
                    </span>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    {result.spendRequests.map((request, index) => (
                      <SpendRequestCard key={request.id} request={request} index={index} />
                    ))}
                  </div>
                </section>

                <FinalAnswer result={result} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Right sidebar ── */}
        <aside className="mt-6 space-y-5 lg:mt-0 lg:sticky lg:top-20 lg:self-start">
          {result ? (
            <>
              <BudgetMeter
                startingBudgetUsd={result.startingBudgetUsd}
                totalSpentUsd={result.totalSpentUsd}
                remainingBudgetUsd={result.remainingBudgetUsd}
              />
              <RunSummary result={result} />
              <ReceiptLedger receipts={result.receipts} />
            </>
          ) : (
            <>
              <ToolCatalogPanel />
              <PolicyEnginePanel />
              {lastInput && (
                <section className="rounded-2xl border border-slate-700 bg-slate-800 p-5">
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-600">
                    Last submitted
                  </p>
                  <p className="text-xs leading-relaxed text-slate-400">{lastInput.goal}</p>
                </section>
              )}
            </>
          )}
        </aside>
      </main>
    </div>
  );
}
