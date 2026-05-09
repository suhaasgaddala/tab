import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
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

const FLOW = ["Open a Tab", "Set a limit", "Spend request", "Auto-approved", "Receipt", "Close the Tab"];

export default function DashboardPage() {
  const { state, run, reset } = useTabRun();
  const [lastInput, setLastInput] = useState<TabRunRequest | null>(null);

  const handleRun = (input: TabRunRequest) => {
    setLastInput(input);
    run(input);
  };

  const handleReset = () => {
    reset();
    setLastInput(null);
  };

  const result = state.status === "success" ? state.result : null;
  const isLoading = state.status === "loading";

  return (
    <div className="min-h-screen bg-zinc-950">
      <TopNav onNewRun={handleReset} />

      <main className="relative overflow-hidden">
        <div className="tab-grid absolute inset-0 -z-20 opacity-40" />
        <div className="absolute left-1/2 top-[-300px] -z-10 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-amber-500/4 blur-3xl pointer-events-none" />
        <div className="absolute right-[-200px] top-[400px] -z-10 h-[400px] w-[400px] rounded-full bg-emerald-500/3 blur-3xl pointer-events-none" />

        {/* Page header */}
        <section className="mx-auto max-w-7xl px-4 pb-6 pt-10 sm:px-6">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/8 px-3 py-1"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse-slow" />
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-amber-400">Tab demo</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="text-4xl font-extrabold tracking-tight text-zinc-50 sm:text-5xl"
            >
              The spend layer for AI agents.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-4 max-w-2xl text-base leading-7 text-zinc-400"
            >
              Open a budget, inspect paid tools, create spend requests, auto-approve policy-safe calls,
              record receipts, and close the Tab with a deterministic spend trace.
            </motion.p>

            {/* Flow steps */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="mt-6 flex flex-wrap items-center gap-2"
            >
              {FLOW.map((item, i) => (
                <div key={item} className="flex items-center gap-2">
                  <span className="rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-zinc-300 shadow-card">
                    <span className="mr-1.5 font-mono text-[10px] text-zinc-600">{i + 1}</span>
                    {item}
                  </span>
                  {i < FLOW.length - 1 && <span className="hidden text-zinc-700 sm:inline font-mono text-xs">›</span>}
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Main grid */}
        <section className="mx-auto grid max-w-7xl gap-5 px-4 pb-16 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          {/* Main column */}
          <div className="space-y-5">
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
                      <p className="text-sm font-bold text-amber-400">Opening Tab</p>
                      <p className="text-xs text-zinc-500 font-mono">
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
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-400">
                        Spend requests
                      </p>
                      <h2 className="mt-1 text-lg font-bold tracking-tight text-zinc-50">
                        Policy checks before every paid call.
                      </h2>
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

          {/* Sidebar */}
          <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
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
                {/* Tool catalog */}
                <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 shadow-card">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600 mb-4">
                    Tool catalog
                  </p>
                  <div className="divide-y divide-zinc-800">
                    {[
                      ["market-signal", "DexScreener", "$0.020", "market-data"],
                      ["model-call", "Anthropic", "$0.001", "inference"],
                    ].map(([tool, provider, price, category]) => (
                      <div key={tool} className="flex items-center justify-between gap-4 py-3">
                        <div>
                          <p className="font-mono text-xs font-bold text-zinc-100">{tool}</p>
                          <p className="mt-0.5 text-[11px] text-zinc-500">
                            {provider} · {category}
                          </p>
                        </div>
                        <span className="font-mono text-sm font-bold text-amber-400">{price}</span>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Backbone note */}
                <section className="rounded-2xl border border-amber-500/10 bg-amber-500/5 p-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-600 mb-3">
                    Backbone
                  </p>
                  <p className="text-xs leading-6 text-zinc-400">
                    The existing x402 router remains the payment and paid-tool backbone. This demo shows
                    the Tab spend-control layer on top.
                  </p>
                </section>

                {lastInput && (
                  <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 shadow-card">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600 mb-3">
                      Last submitted
                    </p>
                    <p className="text-xs leading-6 text-zinc-400">{lastInput.goal}</p>
                  </section>
                )}
              </>
            )}
          </aside>
        </section>
      </main>
    </div>
  );
}
