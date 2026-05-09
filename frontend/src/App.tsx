import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { BudgetMeter } from "./components/BudgetMeter";
import { FinalAnswer } from "./components/FinalAnswer";
import { GoalForm } from "./components/GoalForm";
import { PlanReveal } from "./components/PlanReveal";
import { ReceiptLedger } from "./components/ReceiptLedger";
import { RunSummary } from "./components/RunSummary";
import { SpendRequestCard } from "./components/SpendRequestCard";
import { TopNav } from "./components/TopNav";
import { useTabRun } from "./hooks/useTabRun";
import type { TabRunRequest } from "./lib/types";

const FLOW = ["Open a Tab", "Set a limit", "Spend request", "Auto-approved", "Receipt", "Close the Tab"];

export default function App() {
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
    <div className="min-h-screen bg-slate-50">
      <TopNav onNewRun={handleReset} />

      <main className="relative overflow-hidden">
        <div className="tab-grid absolute inset-0 -z-20" />
        <div className="absolute left-1/2 top-[-280px] -z-10 h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-indigo-200/40 blur-3xl" />
        <div className="absolute right-[-180px] top-[360px] -z-10 h-[420px] w-[420px] rounded-full bg-emerald-200/30 blur-3xl" />

        <section className="mx-auto max-w-7xl px-4 pb-8 pt-12 sm:px-6 lg:pt-16">
          <div className="max-w-3xl">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center rounded-full border border-indigo-100 bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-indigo-700 shadow-card"
            >
              Tab demo
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="mt-5 text-4xl font-extrabold tracking-tight text-slate-950 sm:text-6xl"
            >
              The spend layer for AI agents.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-5 max-w-2xl text-lg leading-8 text-slate-600"
            >
              Open a budget, inspect paid tools, create spend requests, auto-approve policy-safe calls,
              record receipts, and close the Tab with a deterministic spend trace.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="mt-7 flex flex-wrap items-center gap-2"
            >
              {FLOW.map((item, index) => (
                <div key={item} className="flex items-center gap-2">
                  <span className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-card">
                    <span className="mr-2 font-mono text-[10px] text-slate-400">{index + 1}</span>
                    {item}
                  </span>
                  {index < FLOW.length - 1 && <span className="hidden text-slate-300 sm:inline">-&gt;</span>}
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-6 px-4 pb-16 sm:px-6 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="space-y-6">
            <GoalForm isLoading={isLoading} onSubmit={handleRun} />

            <AnimatePresence mode="wait">
              {isLoading && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="rounded-2xl border border-indigo-100 bg-white px-5 py-4 shadow-card"
                >
                  <div className="flex items-center gap-3">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="h-4 w-4 rounded-full border-2 border-indigo-200 border-t-indigo-600"
                    />
                    <div>
                      <p className="text-sm font-bold text-indigo-700">Opening Tab</p>
                      <p className="text-xs text-slate-500">
                        Sending JSON to POST /v1/tab/run and waiting for the spend trace.
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
                  className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700"
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
                  className="space-y-6"
                >
                  <PlanReveal plan={result.plan} />

                  <section id="requests" className="space-y-3">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-indigo-600">
                        Spend request
                      </p>
                      <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-950">
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
                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Tool catalog
                  </p>
                  <div className="mt-4 divide-y divide-slate-100">
                    {[
                      ["market-signal", "DexScreener", "$0.020", "market-data"],
                      ["model-call", "Anthropic", "$0.001", "inference"]
                    ].map(([tool, provider, price, category]) => (
                      <div key={tool} className="flex items-center justify-between gap-4 py-3">
                        <div>
                          <p className="font-mono text-xs font-bold text-slate-950">{tool}</p>
                          <p className="mt-0.5 text-xs text-slate-500">{provider} - {category}</p>
                        </div>
                        <span className="font-mono text-sm font-bold text-amber-700">{price}</span>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="rounded-2xl border border-indigo-100 bg-indigo-50 p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-indigo-700">
                    Backbone
                  </p>
                  <p className="mt-3 text-sm leading-6 text-indigo-800">
                    The existing x402 router remains the payment and paid-tool backbone. This demo shows
                    the Tab spend-control layer on top.
                  </p>
                </section>

                {lastInput && (
                  <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                      Last submitted
                    </p>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{lastInput.goal}</p>
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
