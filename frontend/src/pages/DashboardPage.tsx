import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState } from "react";
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
      badge: "border-emerald-500/20 bg-emerald-500/8 text-emerald-400",
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
    <section id="policy" className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
      <div className="border-b border-zinc-800 px-5 py-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
          Paid Tool Catalog
        </p>
        <p className="mt-0.5 text-sm font-bold text-zinc-100">
          Tools available to this agent
        </p>
      </div>

      <div className="divide-y divide-zinc-800/60">
        {TOOL_CATALOG.map((tool) => {
          const meta = statusMeta[tool.status];
          return (
            <div key={tool.id} className="px-5 py-4">
              <div className="mb-2 flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-mono text-sm font-bold text-zinc-100">{tool.id}</p>
                  <p className="mt-0.5 text-[11px] text-zinc-500">
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
              <p className="text-[11px] leading-relaxed text-zinc-600">{tool.desc}</p>
              <p className="mt-1.5 font-mono text-[10px] text-zinc-700">→ {tool.decision}</p>
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
    <section className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
      <div className="border-b border-zinc-800 px-5 py-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
          Policy Engine
        </p>
        <p className="mt-0.5 text-sm font-bold text-zinc-100">
          Rules applied per spend request
        </p>
      </div>

      <div className="divide-y divide-zinc-800/50 px-5">
        {POLICY_RULES.map((rule) => (
          <div key={rule.label} className="flex items-center justify-between gap-4 py-2.5">
            <span className="text-xs text-zinc-500">{rule.label}</span>
            <span className={`font-mono text-[11px] font-semibold ${
              rule.type === "allowed"
                ? "text-emerald-400"
                : rule.type === "blocked"
                ? "text-red-400"
                : "text-zinc-400"
            }`}>
              {rule.value}
            </span>
          </div>
        ))}
      </div>

      <div className="border-t border-zinc-800 px-5 py-3">
        <p className="font-mono text-[10px] text-zinc-700">
          Policy-controlled paid tool access for agents
        </p>
      </div>
    </section>
  );
}

// ─── Hero section ─────────────────────────────────────────────────────────────
function HeroSection({ onRunDemo }: { onRunDemo: () => void }) {
  return (
    <section className="relative overflow-hidden border-b border-zinc-800/60 pb-14 pt-10">
      <div className="tab-grid absolute inset-0 opacity-25" />
      <div className="pointer-events-none absolute left-1/4 top-0 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-amber-500/6 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-56 w-56 rounded-full bg-emerald-500/4 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        {/* Badges */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex flex-wrap gap-2"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/8 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-amber-400">
            <span className="h-1 w-1 animate-pulse-slow rounded-full bg-amber-400" />
            Reproducible judging mode
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">
            Powered by x402 paid-tool backbone
          </span>
        </motion.div>

        <div className="grid items-end gap-10 lg:grid-cols-[1fr_auto]">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 }}
              className="text-5xl font-extrabold leading-[1.06] tracking-tight text-zinc-50 sm:text-6xl lg:text-[4.5rem]"
            >
              The spend layer<br />
              for <span className="text-amber-400">AI agents.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.13 }}
              className="mt-5 max-w-xl text-lg leading-relaxed text-zinc-400"
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
                className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3 text-sm font-bold text-zinc-950 shadow-[0_0_24px_rgba(245,158,11,0.2)] transition-all hover:bg-amber-400 hover:shadow-[0_0_36px_rgba(245,158,11,0.35)]"
              >
                Run Agent Demo
                <svg viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5">
                  <path d="M3 3.732a1.5 1.5 0 0 1 2.305-1.265l6.706 4.267a1.5 1.5 0 0 1 0 2.531l-6.706 4.268A1.5 1.5 0 0 1 3 12.268V3.732Z" />
                </svg>
              </button>
              <a
                href="#answer"
                className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 px-6 py-3 text-sm font-bold text-zinc-400 transition-all hover:border-zinc-500 hover:text-zinc-200"
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
                className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/80 px-4 py-2.5"
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-amber-500/20 bg-amber-500/8 font-mono text-[10px] font-bold text-amber-400">
                  {item.step}
                </span>
                <p className="text-xs text-zinc-400">{item.label}</p>
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
    <div className="min-h-screen bg-zinc-950">
      <TopNav onNewRun={handleReset} />

      <HeroSection onRunDemo={scrollToForm} />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:grid lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-6">
        {/* ── Left column ── */}
        <div className="space-y-5" ref={formRef} id="goal">
          <GoalForm isLoading={isLoading} onSubmit={handleRun} />

          <AnimatePresence mode="wait">
            {isLoading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="rounded-2xl border border-amber-500/10 bg-amber-500/5 px-5 py-4"
              >
                <div className="flex items-center gap-3">
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="h-4 w-4 rounded-full border-2 border-amber-900 border-t-amber-400"
                  />
                  <div>
                    <p className="text-sm font-bold text-amber-400">Tab open — agent running</p>
                    <p className="font-mono text-xs text-zinc-500">
                      POST /v1/tab/run — waiting for spend trace
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

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
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-400">
                        Spend Requests
                      </p>
                      <h2 className="mt-0.5 text-base font-bold text-zinc-50">
                        Policy check before every paid call
                      </h2>
                    </div>
                    <span className="rounded-full border border-zinc-700 px-3 py-0.5 font-mono text-[10px] text-zinc-500">
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
                <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-zinc-600">
                    Last submitted
                  </p>
                  <p className="text-xs leading-relaxed text-zinc-400">{lastInput.goal}</p>
                </section>
              )}
            </>
          )}
        </aside>
      </main>
    </div>
  );
}
