import { motion } from "framer-motion";
import { useState } from "react";
import type { TabRunRequest } from "../lib/types";

const USDC_BASE = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";

type Scenario = "happy" | "constrained" | "custom";

const PRESETS = {
  happy: {
    label: "Happy path",
    desc: "$0.050 · market-data + inference approved",
    goal: "Analyze USDC liquidity on Base with a 5 cent budget.",
    budget: 0.05,
    maxCalls: 3,
  },
  constrained: {
    label: "Constrained budget",
    desc: "$0.0205 · inference skipped — budget limit",
    goal: "Analyze USDC liquidity on Base with a 2 cent budget.",
    budget: 0.0205,
    maxCalls: 3,
  },
} as const;

interface GoalFormProps {
  isLoading: boolean;
  onSubmit: (input: TabRunRequest) => void;
}

export function GoalForm({ isLoading, onSubmit }: GoalFormProps) {
  const [scenario, setScenario] = useState<Scenario>("happy");
  const [goal, setGoal] = useState<string>(PRESETS.happy.goal);
  const [token, setToken] = useState<string>(USDC_BASE);
  const [budget, setBudget] = useState<number>(PRESETS.happy.budget);
  const [maxToolCalls, setMaxToolCalls] = useState<number>(PRESETS.happy.maxCalls);

  const applyPreset = (key: "happy" | "constrained") => {
    const p = PRESETS[key];
    setScenario(key);
    setGoal(p.goal);
    setBudget(p.budget);
    setMaxToolCalls(p.maxCalls);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal.trim() || isLoading) return;
    onSubmit({
      goal: goal.trim(),
      token: token.trim() || undefined,
      chain: "base",
      budget_usd: budget,
      max_tool_calls: maxToolCalls,
    });
  };

  const inputClass =
    "w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 outline-none transition focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/10";

  return (
    <motion.form
      onSubmit={submit}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-card-lg"
    >
      {/* ── Judging mode scenario selector ── */}
      <div className="border-b border-zinc-800 px-5 py-4">
        <div className="mb-3 flex items-center gap-2">
          <span className="h-1.5 w-1.5 animate-pulse-slow rounded-full bg-amber-400" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">
            Reproducible judging mode
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {(["happy", "constrained"] as const).map((key) => {
            const p = PRESETS[key];
            const active = scenario === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => applyPreset(key)}
                className={`rounded-xl border px-3.5 py-3 text-left transition-all ${
                  active
                    ? "border-amber-500/40 bg-amber-500/8"
                    : "border-zinc-800 bg-zinc-950 hover:border-zinc-700"
                }`}
              >
                <p className={`text-xs font-bold ${active ? "text-zinc-100" : "text-zinc-400"}`}>
                  {p.label}
                </p>
                <p className="mt-0.5 text-[10px] leading-snug text-zinc-600">{p.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Inputs ── */}
      <div className="space-y-4 px-5 py-5">
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="goal" className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
              Agent goal
            </label>
            {scenario === "custom" && (
              <span className="rounded-full border border-zinc-700 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-zinc-600">
                Custom
              </span>
            )}
          </div>
          <textarea
            id="goal"
            rows={2}
            value={goal}
            onChange={(e) => { setGoal(e.target.value); setScenario("custom"); }}
            className={`${inputClass} resize-none leading-relaxed`}
          />
        </div>

        <div>
          <label htmlFor="token" className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
            Token
          </label>
          <input
            id="token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className={`${inputClass} font-mono text-xs`}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-[1fr_150px]">
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label htmlFor="budget" className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
                Agent budget
              </label>
              <span className="font-mono text-sm font-bold text-amber-400">
                ${budget.toFixed(4).replace(/0+$/, "").replace(/\.$/, "")}
              </span>
            </div>
            <input
              id="budget"
              type="range"
              min={0.005}
              max={0.1}
              step={0.0005}
              value={budget}
              onChange={(e) => { setBudget(parseFloat(e.target.value)); setScenario("custom"); }}
              className="w-full"
            />
            <div className="mt-1 flex justify-between font-mono text-[10px] text-zinc-700">
              <span>$0.005</span>
              <span>$0.100</span>
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
              id="calls"
              type="number"
              min={1}
              max={10}
              value={maxToolCalls}
              onChange={(e) => { setMaxToolCalls(Number(e.target.value)); setScenario("custom"); }}
              className={`${inputClass} h-[44px] font-mono`}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={!goal.trim() || isLoading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-3.5 text-sm font-bold text-zinc-950 shadow-[0_0_20px_rgba(245,158,11,0.15)] transition-all hover:bg-amber-400 hover:shadow-[0_0_32px_rgba(245,158,11,0.3)] disabled:cursor-not-allowed disabled:opacity-40"
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
