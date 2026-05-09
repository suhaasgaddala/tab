import { motion } from "framer-motion";
import { useState } from "react";
import type { TabRunRequest } from "../lib/types";

const USDC_BASE = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";

const HAPPY_PATH: TabRunRequest = {
  goal: "Analyze USDC liquidity on Base with a 5 cent budget.",
  token: USDC_BASE,
  chain: "base",
  budget_usd: 0.05
};

const BUDGET_PATH: TabRunRequest = {
  goal: "Analyze USDC liquidity on Base with a 2 cent budget.",
  token: USDC_BASE,
  chain: "base",
  budget_usd: 0.0205
};

interface GoalFormProps {
  isLoading: boolean;
  onSubmit: (input: TabRunRequest) => void;
}

export function GoalForm({ isLoading, onSubmit }: GoalFormProps) {
  const [goal, setGoal] = useState(HAPPY_PATH.goal);
  const [token, setToken] = useState(HAPPY_PATH.token ?? "");
  const [budget, setBudget] = useState(HAPPY_PATH.budget_usd);
  const [maxToolCalls, setMaxToolCalls] = useState(3);

  const applyScenario = (scenario: TabRunRequest) => {
    setGoal(scenario.goal);
    setToken(scenario.token ?? "");
    setBudget(scenario.budget_usd);
    setMaxToolCalls(scenario.max_tool_calls ?? 3);
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!goal.trim() || isLoading) return;

    onSubmit({
      goal: goal.trim(),
      token: token.trim() || undefined,
      chain: "base",
      budget_usd: budget,
      max_tool_calls: maxToolCalls
    });
  };

  return (
    <motion.form
      onSubmit={submit}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card-lg"
    >
      <div className="border-b border-slate-100 px-6 py-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-indigo-600">
          Open a Tab
        </p>
        <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-950">
          Give the agent a goal and a hard spend limit.
        </h2>
      </div>

      <div className="space-y-5 px-6 py-5">
        <div>
          <label htmlFor="goal" className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            Goal
          </label>
          <textarea
            id="goal"
            rows={3}
            value={goal}
            onChange={(event) => setGoal(event.target.value)}
            className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-relaxed text-slate-950 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
          />
        </div>

        <div>
          <label htmlFor="token" className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            Token
          </label>
          <input
            id="token"
            value={token}
            onChange={(event) => setToken(event.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-mono text-xs text-slate-950 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-[1fr_180px]">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label htmlFor="budget" className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Set a limit
              </label>
              <span className="font-mono text-sm font-bold text-amber-700">${budget.toFixed(budget === 0.0205 ? 4 : 3)}</span>
            </div>
            <input
              id="budget"
              type="range"
              min={0}
              max={1}
              step={1}
              value={budget === 0.0205 ? 0 : 1}
              onChange={(event) => setBudget(Number(event.target.value) === 0 ? 0.0205 : 0.05)}
              className="w-full"
            />
            <div className="mt-1 flex justify-between font-mono text-[10px] text-slate-400">
              <span>$0.0205</span>
              <span>$0.050</span>
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label htmlFor="calls" className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Max calls
              </label>
              <span className="font-mono text-sm font-bold text-indigo-700">{maxToolCalls}</span>
            </div>
            <input
              id="calls"
              type="number"
              min={0}
              max={5}
              value={maxToolCalls}
              onChange={(event) => setMaxToolCalls(Number(event.target.value))}
              className="h-[46px] w-full rounded-xl border border-slate-200 bg-slate-50 px-4 font-mono text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
            />
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => applyScenario(HAPPY_PATH)}
            className="rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-left text-xs font-semibold text-indigo-700 transition hover:border-indigo-200 hover:bg-indigo-100"
          >
            Happy path: 5 cent Tab
          </button>
          <button
            type="button"
            onClick={() => applyScenario(BUDGET_PATH)}
            className="rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-left text-xs font-semibold text-amber-800 transition hover:border-amber-200 hover:bg-amber-100"
          >
            Budget limit: 2 cent Tab
          </button>
        </div>

        <button
          type="submit"
          disabled={!goal.trim() || isLoading}
          className="flex w-full items-center justify-center rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white shadow-card transition hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400"
        >
          {isLoading ? "Opening Tab..." : "Open a Tab"}
        </button>
      </div>
    </motion.form>
  );
}
