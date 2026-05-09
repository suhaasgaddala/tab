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

interface GoalFormProps {
  isLoading: boolean;
  onSubmit: (input: TabRunRequest) => void;
}

export function GoalForm({ isLoading, onSubmit }: GoalFormProps) {
  const [goal, setGoal] = useState(HAPPY_PATH.goal);
  const [token, setToken] = useState(HAPPY_PATH.token ?? "");
  const [budget, setBudget] = useState(HAPPY_PATH.budget_usd);
  const [maxToolCalls, setMaxToolCalls] = useState(3);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!goal.trim() || isLoading) return;
    onSubmit({ goal: goal.trim(), token: token.trim() || undefined, chain: "base", budget_usd: budget, max_tool_calls: maxToolCalls });
  };

  const inputClass = "w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 outline-none transition focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/10";

  return (
    <motion.form
      onSubmit={submit}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-card-lg"
    >
      <div className="border-b border-zinc-800 px-6 py-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-400">
          Open a Tab
        </p>
        <h2 className="mt-1 text-lg font-bold tracking-tight text-zinc-50">
          Give the agent a goal and a hard spend limit.
        </h2>
      </div>

      <div className="space-y-5 px-6 py-5">
        <div>
          <label htmlFor="goal" className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
            Goal
          </label>
          <textarea
            id="goal" rows={3} value={goal}
            onChange={e => setGoal(e.target.value)}
            className={`${inputClass} resize-none leading-relaxed`}
          />
        </div>

        <div>
          <label htmlFor="token" className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
            Token
          </label>
          <input
            id="token" value={token} onChange={e => setToken(e.target.value)}
            className={`${inputClass} font-mono text-xs`}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-[1fr_160px]">
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label htmlFor="budget" className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
                Set a limit
              </label>
              <span className="font-mono text-sm font-bold text-amber-400">${budget.toFixed(3)}</span>
            </div>
            <input
              id="budget" type="range" min={0.005} max={0.1} step={0.001}
              value={budget} onChange={e => setBudget(parseFloat(e.target.value))}
              className="w-full"
            />
            <div className="mt-1 flex justify-between font-mono text-[10px] text-zinc-600">
              <span>$0.005</span><span>$0.100</span>
            </div>
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label htmlFor="calls" className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
                Max calls
              </label>
              <span className="font-mono text-sm font-bold text-zinc-300">{maxToolCalls}</span>
            </div>
            <input
              id="calls" type="number" min={1} max={5}
              value={maxToolCalls} onChange={e => setMaxToolCalls(Number(e.target.value))}
              className={`${inputClass} h-[46px] font-mono`}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={!goal.trim() || isLoading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-3 text-sm font-bold text-zinc-950 shadow-glow transition-all hover:bg-amber-400 hover:shadow-[0_0_32px_rgba(245,158,11,0.32)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isLoading ? (
            <>
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
                className="h-4 w-4 rounded-full border-2 border-amber-800 border-t-zinc-950"
              />
              Opening Tab...
            </>
          ) : (
            "Open a Tab"
          )}
        </button>
      </div>
    </motion.form>
  );
}
