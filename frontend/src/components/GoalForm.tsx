import { motion } from "framer-motion";
import { useState } from "react";
import type { TabRunRequest } from "../lib/types";

const USDC_BASE = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";

type Scenario = "standard" | "tight" | "oneCall" | "custom";

const PRESETS = {
  standard: {
    label: "Standard: $0.05 / 3 calls",
    desc: "Both paid tools can clear policy.",
    goal: "Analyze USDC liquidity on Base with a 5 cent budget.",
    budget: 0.05,
    maxCalls: 3,
  },
  tight: {
    label: "Tight budget: $0.0205 / 3 calls",
    desc: "Market data fits; inference should be skipped.",
    goal: "Analyze USDC liquidity on Base with a 2.05 cent budget.",
    budget: 0.0205,
    maxCalls: 3,
  },
  oneCall: {
    label: "One call max: $0.05 / 1 call",
    desc: "Second paid call should hit the max-call policy.",
    goal: "Analyze USDC liquidity on Base with one paid call maximum.",
    budget: 0.05,
    maxCalls: 1,
  },
} as const;

function formatUsd(value: number) {
  return value.toFixed(4).replace(/0+$/, "").replace(/\.$/, "");
}

function coercePositiveNumber(value: string, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

interface GoalFormProps {
  isLoading: boolean;
  onSubmit: (input: TabRunRequest) => void;
}

export function GoalForm({ isLoading, onSubmit }: GoalFormProps) {
  const [scenario, setScenario] = useState<Scenario>("standard");
  const [goal, setGoal] = useState<string>(PRESETS.standard.goal);
  const [token, setToken] = useState<string>(USDC_BASE);
  const [budget, setBudget] = useState<number>(PRESETS.standard.budget);
  const [maxToolCalls, setMaxToolCalls] = useState<number>(PRESETS.standard.maxCalls);

  const requestPayload: TabRunRequest = {
    goal: goal.trim(),
    token: token.trim(),
    chain: "base",
    budget_usd: budget,
    max_tool_calls: maxToolCalls,
  };

  const applyPreset = (key: "standard" | "tight" | "oneCall") => {
    const p = PRESETS[key];
    setScenario(key);
    setGoal(p.goal);
    setBudget(p.budget);
    setMaxToolCalls(p.maxCalls);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestPayload.goal || !requestPayload.token || isLoading) return;
    onSubmit(requestPayload);
  };

  const inputClass =
    "w-full rounded-xl border border-[#FFF8F2]/12 bg-[#1E1917]/50 px-4 py-3 text-sm text-[#FFF8F2] placeholder:text-[#FFF8F2]/30 outline-none transition focus:border-[#FF5848]/55 focus:ring-2 focus:ring-[#FF5848]/14";

  return (
    <motion.form
      onSubmit={submit}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="tab-card overflow-hidden rounded-2xl"
    >
      {/* ── Scenario presets ── */}
      <div className="border-b border-[#FFF8F2]/10 px-5 py-4">
        <div className="mb-3 flex items-center gap-2">
          <span className="h-1.5 w-1.5 animate-pulse-slow rounded-full" style={{ background: "#FF5848" }} />
          <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#FF5848" }}>
            Reproducible judging mode
          </span>
        </div>
        <div className="grid gap-2 md:grid-cols-3">
          {(["standard", "tight", "oneCall"] as const).map((key) => {
            const p = PRESETS[key];
            const active = scenario === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => applyPreset(key)}
                className={`rounded-xl border px-3.5 py-3 text-left transition-all cursor-pointer ${
                  active
                    ? "border-[#FF5848]/44 bg-[#FF5848]/10"
                    : "border-[#FFF8F2]/12 bg-[#1E1917]/40 hover:border-[#FFF8F2]/24 hover:bg-[#FFF8F2]/6"
                }`}
              >
                <p className={`text-xs font-bold ${active ? "text-[#FFF8F2]" : "text-[#FFF8F2]/62"}`}>
                  {p.label}
                </p>
                <p className="mt-0.5 text-[10px] leading-snug text-[#FFF8F2]/38">{p.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Inputs ── */}
      <div className="space-y-4 px-5 py-5">
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="goal" className="text-xs font-semibold uppercase tracking-[0.14em] text-[#FFF8F2]/44">
              Agent goal
            </label>
            {scenario === "custom" && (
              <span className="rounded-full border border-[#FFF8F2]/14 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-[#FFF8F2]/38">
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
          <label htmlFor="token" className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-[#FFF8F2]/44">
            Token / asset address
          </label>
          <input
            id="token"
            value={token}
            onChange={(e) => { setToken(e.target.value); setScenario("custom"); }}
            className={`${inputClass} font-mono text-xs`}
          />
          <p className="mt-1.5 text-xs text-[#FFF8F2]/42">
            Default demo asset: USDC on Base.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-[1fr_150px]">
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label htmlFor="budget" className="text-xs font-semibold uppercase tracking-[0.14em] text-[#FFF8F2]/44">
                Agent budget
              </label>
              <span className="font-mono text-sm font-bold text-amber-400">
                ${formatUsd(budget)}
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
            <div className="mt-2 flex items-center gap-3">
              <input
                aria-label="Agent budget exact value"
                type="number"
                min={0.005}
                max={0.1}
                step={0.0001}
                value={budget}
                onChange={(e) => { setBudget(coercePositiveNumber(e.target.value, budget)); setScenario("custom"); }}
                className={`${inputClass} h-10 max-w-[132px] px-3 py-2 font-mono text-xs`}
              />
              <div className="flex flex-1 justify-between font-mono text-[10px] text-[#FFF8F2]/30">
                <span>$0.005</span>
                <span>$0.100</span>
              </div>
            </div>
            <div className="mt-3 rounded-xl border border-[#F0B28C]/22 bg-[#F0B28C]/10 px-3 py-2">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-amber-500/80">
                Policy threshold
              </p>
              <p className="mt-1 text-xs leading-relaxed text-[#FFF8F2]/54">
                market-signal costs $0.020; model-call costs $0.001; both tools require about $0.021.
                Budgets above this threshold may run the same two-tool plan; the remaining balance changes.
              </p>
            </div>
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label htmlFor="calls" className="text-xs font-semibold uppercase tracking-[0.14em] text-[#FFF8F2]/44">
                Max calls
              </label>
              <span className="font-mono text-sm font-bold text-[#FFF8F2]">{maxToolCalls}</span>
            </div>
            <input
              id="calls"
              type="number"
              min={1}
              max={10}
              value={maxToolCalls}
              onChange={(e) => { setMaxToolCalls(Math.trunc(coercePositiveNumber(e.target.value, maxToolCalls))); setScenario("custom"); }}
              className={`${inputClass} h-[44px] font-mono`}
            />
          </div>
        </div>

        <section className="rounded-xl border border-[#FFF8F2]/12 bg-[#1E1917]/58 p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#FF5848]">
              Request payload
            </p>
            <span className="font-mono text-[10px] text-[#FFF8F2]/38">POST /v1/tab/run</span>
          </div>
          <dl className="grid gap-2 text-xs">
            <div className="flex justify-between gap-4">
              <dt className="text-[#FFF8F2]/38">budget_usd</dt>
              <dd className="font-mono font-bold text-amber-400">{requestPayload.budget_usd}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-[#FFF8F2]/38">max_tool_calls</dt>
              <dd className="font-mono font-bold text-[#FFF8F2]">{requestPayload.max_tool_calls}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-[#FFF8F2]/38">chain</dt>
              <dd className="font-mono font-bold text-[#FFF8F2]">{requestPayload.chain}</dd>
            </div>
            <div>
              <dt className="text-[#FFF8F2]/38">token</dt>
              <dd className="mt-0.5 break-all font-mono text-[11px] text-[#FFF8F2]/70">{requestPayload.token}</dd>
            </div>
            <div>
              <dt className="text-[#FFF8F2]/38">goal</dt>
              <dd className="mt-0.5 text-[#FFF8F2]/70">{requestPayload.goal}</dd>
            </div>
          </dl>
        </section>

        <button
          type="submit"
          disabled={!requestPayload.goal || !requestPayload.token || isLoading}
          className="flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-semibold text-white shadow-glow transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer" style={{ background: "#FF5848" }}
        >
          {isLoading ? (
            <>
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
                className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white"
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
