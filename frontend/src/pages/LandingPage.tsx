import { AnimatePresence, motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useTabRun } from "../hooks/useTabRun";
import type { TabRunRequest, TabRunResult } from "../lib/types";

// ─── Scroll-reveal ────────────────────────────────────────────────────────────
function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────
function IconArrow({ size = 4 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={`w-${size} h-${size}`}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
    </svg>
  );
}
function IconCheck() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-3.5 h-3.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  );
}
function IconX() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-3.5 h-3.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
  );
}
function IconLoader() {
  return (
    <motion.svg
      viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
      className="w-4 h-4"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    >
      <path strokeLinecap="round" d="M12 2a10 10 0 0 1 10 10" />
    </motion.svg>
  );
}

// ─── Nav ─────────────────────────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 48);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <nav className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? "bg-slate-900/95 backdrop-blur-md border-b border-slate-700/60" : "bg-transparent"}`}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5 group">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500 font-mono text-sm font-black text-slate-950 shadow-glow transition-shadow group-hover:shadow-[0_0_32px_rgba(34,197,94,0.35)]">
            T
          </span>
          <span className="text-base font-bold tracking-tight text-slate-50">Tab</span>
        </Link>

        <div className="hidden items-center gap-8 text-sm font-medium md:flex">
          {[["How it works", "#workflow"], ["Demo", "#demo"], ["Compare", "#compare"]].map(([label, href]) => (
            <a key={label as string} href={href as string} className="text-slate-400 hover:text-slate-50 transition-colors">
              {label as string}
            </a>
          ))}
        </div>

        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-sm font-bold text-slate-950 shadow-glow transition-all hover:bg-green-400 hover:shadow-[0_0_32px_rgba(34,197,94,0.35)]"
        >
          Open a Tab <IconArrow />
        </Link>
      </div>
    </nav>
  );
}

// ─── Hero: Layered card cluster ───────────────────────────────────────────────
function HeroCardCluster() {
  const [phase, setPhase] = useState<0 | 1 | 2>(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 1800);
    const t2 = setTimeout(() => setPhase(2), 3000);
    const t3 = setTimeout(() => { setPhase(0); }, 5200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  useEffect(() => {
    if (phase !== 0) return;
    const t1 = setTimeout(() => setPhase(1), 1800);
    const t2 = setTimeout(() => setPhase(2), 3000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [phase]);

  const spent = phase >= 1 ? 40 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full max-w-sm mx-auto lg:mx-0 lg:ml-auto"
    >
      {/* Back card: Budget overview (rotated behind) */}
      <div
        className="absolute inset-0 -rotate-3 -translate-x-2 translate-y-3 scale-[0.96] opacity-50 pointer-events-none"
        aria-hidden
      >
        <div className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-800">
          <div className="px-5 py-4 border-b border-slate-700">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Session budget</p>
          </div>
          <div className="px-5 py-4">
            <div className="h-1.5 rounded-full bg-slate-700 mb-3">
              <div className="h-full w-2/5 rounded-full bg-green-500/50" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-lg border border-amber-500/10 bg-amber-500/5 p-2.5">
                <p className="text-[10px] text-amber-600 mb-0.5">Spent</p>
                <p className="font-mono text-base font-black text-amber-400">$0.020</p>
              </div>
              <div className="rounded-lg border border-green-500/10 bg-green-500/5 p-2.5">
                <p className="text-[10px] text-green-600 mb-0.5">Left</p>
                <p className="font-mono text-base font-black text-green-400">$0.030</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main card: Spend request */}
      <div className="relative z-10 overflow-hidden rounded-2xl border border-slate-700 bg-slate-800 shadow-card-lg">
        <div className="flex items-center gap-3 border-b border-slate-700 px-5 py-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-green-500/20 bg-green-500/10">
            <span className="font-mono text-[10px] font-black text-green-400">AI</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-50">ResearchAgent</p>
            <p className="text-[11px] text-slate-500 font-mono">spend request</p>
          </div>
          <AnimatePresence mode="wait">
            {phase === 0 && (
              <motion.span key="p" exit={{ opacity: 0, scale: 0.9 }}
                className="rounded-full bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-amber-400">
                Pending
              </motion.span>
            )}
            {phase >= 1 && (
              <motion.span key="a" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="rounded-full bg-green-500/10 border border-green-500/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-green-400">
                Approved
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <div className="divide-y divide-slate-700/60 px-5">
          {[["Tool", "market-signal", false], ["Provider", "DexScreener", false], ["Category", "market-data", false], ["Amount", "$0.020", true]].map(
            ([label, val, hi]) => (
              <div key={label as string} className="flex items-center justify-between py-3">
                <span className="text-xs text-slate-500">{label as string}</span>
                <span className={`font-mono text-xs font-semibold ${hi ? "text-amber-400" : "text-slate-300"}`}>{val as string}</span>
              </div>
            )
          )}
        </div>

        <div className="px-5 pb-4 pt-2">
          <AnimatePresence mode="wait">
            {phase === 0 && (
              <motion.div key="eval" exit={{ opacity: 0 }}
                className="flex items-center gap-2 rounded-xl border border-slate-600 bg-slate-700 px-3 py-2.5">
                <motion.div className="h-3.5 w-3.5 rounded-full border-2 border-slate-500 border-t-green-400"
                  animate={{ rotate: 360 }} transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }} />
                <span className="text-xs text-slate-400">Evaluating policy...</span>
              </motion.div>
            )}
            {phase >= 1 && (
              <motion.div key="ok" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 rounded-xl border border-green-500/20 bg-green-500/10 px-3 py-2.5">
                <span className="text-green-400 text-sm">✓</span>
                <span className="text-xs font-semibold text-green-400">Policy approved</span>
                <span className="ml-auto text-[10px] text-green-700 font-mono">within-budget</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Receipt chip — front layer, slides in */}
      <AnimatePresence>
        {phase === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 8, x: 12 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className="relative z-20 mt-2.5 flex items-center gap-3 rounded-xl border border-green-500/20 bg-green-500/5 px-4 py-3 shadow-[0_0_16px_rgba(34,197,94,0.08)]"
          >
            <span className="text-[10px] font-black uppercase tracking-widest text-green-400">✓ Receipt</span>
            <span className="font-mono text-[10px] text-slate-500">market-signal · $0.020 · x402 · base-sepolia</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Budget bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="relative z-10 mt-2.5 rounded-xl border border-slate-700 bg-slate-800 px-4 py-3"
      >
        <div className="flex justify-between text-[11px] mb-2">
          <span className="text-slate-500 font-mono">Session budget</span>
          <span className="font-mono text-slate-300">
            <AnimatePresence mode="wait">
              <motion.span key={phase} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                ${(spent / 1000).toFixed(3)} / $0.050
              </motion.span>
            </AnimatePresence>
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-700">
          <motion.div
            animate={{ width: `${spent}%` }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="h-full rounded-full bg-amber-500"
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Section 1: Hero ─────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-slate-900">
      <div className="tab-grid absolute inset-0 opacity-60" />
      <div className="absolute -left-64 -top-64 h-[700px] w-[700px] rounded-full bg-green-500/5 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-48 right-[-12rem] h-[500px] w-[500px] rounded-full bg-green-500/4 blur-3xl pointer-events-none" />

      <div className="relative mx-auto w-full max-w-7xl px-4 pb-16 pt-28 sm:px-6">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* Copy */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/8 px-3.5 py-1.5"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse-slow" />
              <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-green-400">
                The spend layer for AI agents
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="font-mono text-5xl font-extrabold leading-[1.04] tracking-tight text-slate-50 sm:text-6xl lg:text-7xl"
            >
              Agents can spend.{" "}
              <span className="text-green-400">Tab</span>
              <br />
              makes them spend
              <br />
              intelligently.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.22 }}
              className="mt-7 max-w-xl text-lg leading-relaxed text-slate-400"
            >
              Tab lets autonomous agents buy paid internet tools under a budget
              and return receipts for every call. Payment rails let agents pay —
              Tab gives agents budgets, spend requests, approvals, and receipts.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.32 }}
              className="mt-10 flex flex-wrap gap-4"
            >
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 rounded-xl bg-green-500 px-6 py-3.5 text-base font-bold text-slate-950 shadow-glow transition-all hover:bg-green-400 hover:shadow-[0_0_40px_rgba(34,197,94,0.35)]"
              >
                Open a Tab <IconArrow />
              </Link>
              <a
                href="#workflow"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-6 py-3.5 text-base font-semibold text-slate-300 transition-all hover:border-slate-500 hover:text-slate-50"
              >
                How it works
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55 }}
              className="mt-12 flex flex-wrap items-center gap-12"
            >
              {[["100%", "Policy coverage"], ["<1ms", "Approval latency"], ["x402", "Payment rail"]].map(([val, label]) => (
                <div key={label}>
                  <p className="font-mono text-2xl font-extrabold text-slate-50">{val}</p>
                  <p className="mt-0.5 text-sm text-slate-500">{label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Layered card cluster */}
          <div className="hidden lg:block">
            <HeroCardCluster />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Section 2: Workflow ──────────────────────────────────────────────────────
const WORKFLOW_STEPS = [
  { n: "01", label: "Open a Tab", desc: "Set a session budget for the agent run" },
  { n: "02", label: "Set a limit", desc: "Hard cap on total spend for this run" },
  { n: "03", label: "Spend request", desc: "Agent requests access to a paid tool" },
  { n: "04", label: "Auto-approved", desc: "Policy engine validates within budget" },
  { n: "05", label: "Receipt", desc: "Cryptographic proof via x402 rail" },
  { n: "06", label: "Close the Tab", desc: "Session complete — full spend trace" },
];

function WorkflowSection() {
  return (
    <section id="workflow" className="border-y border-slate-700/60 bg-slate-900 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <FadeUp>
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-green-400">How Tab works</p>
          <h2 className="font-mono text-3xl font-extrabold tracking-tight text-slate-50 sm:text-4xl">
            From goal to receipt in one run.
          </h2>
        </FadeUp>

        <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {WORKFLOW_STEPS.map((step, i) => (
            <FadeUp key={step.n} delay={i * 0.07}>
              <div className="relative flex flex-col rounded-2xl border border-slate-700 bg-slate-800 p-5 h-full hover:border-slate-600 transition-colors">
                {i < WORKFLOW_STEPS.length - 1 && (
                  <span className="absolute -right-1.5 top-1/2 hidden -translate-y-1/2 text-slate-700 xl:block">›</span>
                )}
                <span className="mb-3 font-mono text-3xl font-black text-slate-700">{step.n}</span>
                <p className="text-sm font-bold text-slate-100">{step.label}</p>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-500">{step.desc}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Section 3+4: Interactive Demo + Expense Report ──────────────────────────
const USDC_BASE = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
const DEFAULT_INPUT: TabRunRequest = {
  goal: "Analyze USDC liquidity on Base with a 5 cent budget.",
  token: USDC_BASE,
  chain: "base",
  budget_usd: 0.05,
  max_tool_calls: 3,
};

function StatusChip({ status }: { status: string }) {
  const styles: Record<string, string> = {
    "auto-approved": "bg-green-500/10 border-green-500/20 text-green-400",
    approved:        "bg-green-500/10 border-green-500/20 text-green-400",
    pending:         "bg-amber-500/10 border-amber-500/20 text-amber-400",
    denied:          "bg-red-500/10   border-red-500/20   text-red-400",
    skipped:         "bg-slate-500/10 border-slate-700    text-slate-400",
  };
  const s = styles[status] ?? styles["pending"];
  const label = status === "auto-approved" ? "Auto-approved" : status;
  return (
    <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest ${s}`}>
      {label}
    </span>
  );
}

function MiniSpendCard({ req, idx }: { req: TabRunResult["spendRequests"][0]; idx: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.07 }}
      className="rounded-xl border border-slate-700 bg-slate-800 p-4"
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-0.5">Spend request #{idx + 1}</p>
          <p className="font-mono text-sm font-bold text-slate-100">{req.tool}</p>
        </div>
        <StatusChip status={req.status} />
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs mb-3">
        <div>
          <p className="text-slate-600">Amount</p>
          <p className="font-mono font-bold text-amber-400">${req.amountUsd.toFixed(3)}</p>
        </div>
        <div>
          <p className="text-slate-600">Category</p>
          <p className="text-slate-300">{req.category}</p>
        </div>
      </div>
      <p className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-[11px] text-slate-500 font-mono">
        {req.policyExplanation ?? req.policyResult ?? "pending"}
      </p>
    </motion.div>
  );
}

function ExpenseReport({ result }: { result: TabRunResult }) {
  const used = result.startingBudgetUsd > 0
    ? Math.min(100, (result.totalSpentUsd / result.startingBudgetUsd) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-4"
    >
      {/* Header row */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded-full border border-slate-700 bg-slate-800 px-3 py-1 font-mono text-[11px] text-slate-400">
          {result.agent}
        </span>
        <span className="rounded-full border border-green-500/20 bg-green-500/8 px-3 py-1 text-[11px] font-bold text-green-400">
          confidence: {result.confidence}
        </span>
        <span className="rounded-full border border-slate-700 px-3 py-1 text-[11px] text-slate-400">
          {result.status.replace("_", " ")}
        </span>
      </div>

      {/* Bento grid */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Budget meter */}
        <div className="rounded-2xl border border-slate-700 bg-slate-800 p-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-4">Budget</p>
          <div className="h-2 overflow-hidden rounded-full bg-slate-700 mb-3">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${used}%` }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="h-full rounded-full bg-amber-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-lg border border-amber-500/10 bg-amber-500/5 p-2.5">
              <p className="text-[10px] text-amber-600 mb-1">Spent</p>
              <p className="font-mono text-base font-black text-amber-400">${result.totalSpentUsd.toFixed(3)}</p>
            </div>
            <div className="rounded-lg border border-green-500/10 bg-green-500/5 p-2.5">
              <p className="text-[10px] text-green-700 mb-1">Remaining</p>
              <p className="font-mono text-base font-black text-green-400">${result.remainingBudgetUsd.toFixed(3)}</p>
            </div>
          </div>
          <p className="mt-3 flex justify-between text-[11px] text-slate-600 font-mono border-t border-slate-700 pt-2">
            <span>Starting budget</span>
            <span className="text-slate-400">${result.startingBudgetUsd.toFixed(3)}</span>
          </p>
        </div>

        {/* Plan */}
        <div className="rounded-2xl border border-slate-700 bg-slate-800 p-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-4">Plan</p>
          <ol className="space-y-3">
            {result.plan.map((step, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex items-start gap-2.5"
              >
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-green-500/20 bg-green-500/8 font-mono text-[10px] font-bold text-green-400">{i + 1}</span>
                <span className="text-xs leading-relaxed text-slate-400">{step}</span>
              </motion.li>
            ))}
          </ol>
        </div>

        {/* Receipt ledger */}
        <div className="rounded-2xl border border-slate-700 bg-slate-800 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600">Receipts</p>
            <span className="font-mono text-[10px] text-slate-500">{result.receipts.length} paid</span>
          </div>
          <div>
            {result.receipts.map((r, i) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.06 }}
                className="border-b border-slate-700 last:border-0 px-5 py-3"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-[10px] font-bold text-slate-500">{r.id}</span>
                  <span className="text-[10px] font-bold text-green-400">✓ {r.status}</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-mono text-slate-400">{r.tool}</span>
                  <span className="font-mono font-bold text-amber-400">${r.amountUsd.toFixed(3)}</span>
                </div>
                <p className="font-mono text-[10px] text-slate-600 mt-0.5">{r.rail} · {r.network}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Spend requests */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-3">Spend requests</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {result.spendRequests.map((req, i) => (
            <MiniSpendCard key={req.id} req={req} idx={i} />
          ))}
        </div>
      </div>

      {/* Final answer */}
      <div className="rounded-2xl border border-slate-700 bg-slate-800 p-5">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-3">Final answer</p>
        <p className="text-sm leading-7 text-slate-300">{result.finalAnswer}</p>
      </div>
    </motion.div>
  );
}

function DemoSection() {
  const { state, run, reset } = useTabRun();
  const [goal, setGoal] = useState(DEFAULT_INPUT.goal);
  const [budget, setBudget] = useState(DEFAULT_INPUT.budget_usd);
  const [maxCalls, setMaxCalls] = useState(3);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal.trim() || state.status === "loading") return;
    run({ goal: goal.trim(), token: USDC_BASE, chain: "base", budget_usd: budget, max_tool_calls: maxCalls });
  };

  const result = state.status === "success" ? state.result : null;
  const isLoading = state.status === "loading";

  return (
    <section id="demo" className="bg-slate-900 py-24 border-y border-slate-700/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <FadeUp>
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-green-400">Live demo</p>
          <h2 className="font-mono text-3xl font-extrabold tracking-tight text-slate-50 sm:text-4xl">
            Agent expense report.
          </h2>
          <p className="mt-3 max-w-2xl text-base text-slate-400 leading-relaxed">
            Give the agent a goal and a hard budget. Tab runs the full spend-control loop — policy checks, spend requests, receipts — and returns a deterministic trace.
          </p>
        </FadeUp>

        <div className="mt-10 grid gap-6 lg:grid-cols-[360px_1fr]">
          {/* Form */}
          <FadeUp delay={0.1}>
            <form onSubmit={handleSubmit} className="sticky top-20 space-y-4 rounded-2xl border border-slate-700 bg-slate-800 p-6">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600">Open a Tab</p>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-400">Goal</label>
                <textarea
                  rows={3}
                  value={goal}
                  onChange={e => setGoal(e.target.value)}
                  className="w-full resize-none rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-100 placeholder-slate-600 outline-none transition focus:border-green-500/50 focus:ring-2 focus:ring-green-500/10"
                />
              </div>

              <div>
                <div className="mb-1.5 flex justify-between">
                  <label className="text-xs font-semibold text-slate-400">Budget limit</label>
                  <span className="font-mono text-sm font-bold text-amber-400">${budget.toFixed(3)}</span>
                </div>
                <input
                  type="range" min={0.005} max={0.1} step={0.001}
                  value={budget} onChange={e => setBudget(parseFloat(e.target.value))}
                  className="w-full"
                />
                <div className="mt-1 flex justify-between font-mono text-[10px] text-slate-600">
                  <span>$0.005</span><span>$0.100</span>
                </div>
              </div>

              <div>
                <div className="mb-1.5 flex justify-between">
                  <label className="text-xs font-semibold text-slate-400">Max tool calls</label>
                  <span className="font-mono text-sm font-bold text-slate-300">{maxCalls}</span>
                </div>
                <input
                  type="number" min={1} max={5}
                  value={maxCalls} onChange={e => setMaxCalls(Number(e.target.value))}
                  className="h-10 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 font-mono text-sm text-slate-100 outline-none transition focus:border-green-500/50 focus:ring-2 focus:ring-green-500/10"
                />
              </div>

              <button
                type="submit"
                disabled={!goal.trim() || isLoading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-500 px-5 py-3 text-sm font-bold text-slate-950 shadow-glow transition-all hover:bg-green-400 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? <><IconLoader />Running...</> : "Open a Tab"}
              </button>

              {result && (
                <button type="button" onClick={reset}
                  className="w-full rounded-xl border border-slate-700 px-5 py-2.5 text-xs font-semibold text-slate-400 transition hover:border-slate-500 hover:text-slate-200 cursor-pointer">
                  Reset
                </button>
              )}
            </form>
          </FadeUp>

          {/* Results */}
          <div>
            <AnimatePresence mode="wait">
              {!result && !isLoading && state.status !== "error" && (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-700 text-center">
                  <p className="font-mono text-sm text-slate-700">Submit a goal to run the agent.</p>
                  <p className="mt-1 text-xs text-slate-800">Results appear here as a full expense report.</p>
                </motion.div>
              )}

              {isLoading && (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex h-64 flex-col items-center justify-center rounded-2xl border border-green-500/10 bg-green-500/5">
                  <motion.div className="h-8 w-8 rounded-full border-2 border-slate-700 border-t-green-400 mb-4"
                    animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
                  <p className="text-sm font-semibold text-green-400">Tab is running...</p>
                  <p className="mt-1 text-xs text-slate-600 font-mono">POST /v1/tab/run · waiting for spend trace</p>
                </motion.div>
              )}

              {state.status === "error" && (
                <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="rounded-2xl border border-red-500/20 bg-red-500/5 px-5 py-4 text-sm text-red-400">
                  <span className="font-bold">Tab run failed: </span>{state.error}
                </motion.div>
              )}

              {result && (
                <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <ExpenseReport result={result} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Section 5: Comparison ────────────────────────────────────────────────────
function ComparisonSection() {
  const left = [
    { label: "Payments", has: true },
    { label: "Budgets", has: false },
    { label: "Spend requests", has: false },
    { label: "Auto-approvals", has: false },
    { label: "Cryptographic receipts", has: false },
    { label: "Policy engine", has: false },
    { label: "Spend trace", has: false },
  ];
  const right = [
    { label: "Payments (via x402)", has: true },
    { label: "Budgets", has: true },
    { label: "Spend requests", has: true },
    { label: "Auto-approvals", has: true },
    { label: "Cryptographic receipts", has: true },
    { label: "Policy engine", has: true },
    { label: "Spend trace", has: true },
  ];

  return (
    <section id="compare" className="bg-slate-900 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <FadeUp>
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-green-400">Why Tab</p>
          <h2 className="font-mono text-3xl font-extrabold tracking-tight text-slate-50 sm:text-4xl">
            Payment rails vs. Tab.
          </h2>
        </FadeUp>

        <div className="mt-12 grid gap-4 md:grid-cols-2 max-w-3xl">
          {/* Left: payment rails */}
          <FadeUp delay={0.08}>
            <div className="h-full rounded-2xl border border-slate-700 bg-slate-800 p-6">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1">Payment rails</p>
              <p className="text-lg font-bold text-slate-300 mb-5">Link gives agents a way to pay.</p>
              <ul className="space-y-2.5">
                {left.map(item => (
                  <li key={item.label} className="flex items-center gap-3">
                    <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${item.has ? "bg-green-500/10 text-green-400" : "bg-slate-700 text-slate-600"}`}>
                      {item.has ? <IconCheck /> : <IconX />}
                    </span>
                    <span className={`text-sm ${item.has ? "text-slate-200" : "text-slate-600"}`}>{item.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </FadeUp>

          {/* Right: Tab */}
          <FadeUp delay={0.15}>
            <div className="h-full rounded-2xl border border-green-500/20 bg-slate-800 p-6 shadow-glow">
              <p className="text-[10px] font-bold uppercase tracking-widest text-green-600 mb-1">Tab</p>
              <p className="text-lg font-bold text-slate-50 mb-5">Tab gives agents budgets, spend requests, approvals, and receipts.</p>
              <ul className="space-y-2.5">
                {right.map(item => (
                  <li key={item.label} className="flex items-center gap-3">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-500/10 text-green-400">
                      <IconCheck />
                    </span>
                    <span className="text-sm text-slate-200">{item.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

// ─── Section 6: Scope ─────────────────────────────────────────────────────────
function ScopeSection() {
  return (
    <section className="border-t border-slate-700/60 bg-slate-800 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-2 items-start">
          <FadeUp>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-green-400">Architecture</p>
            <h2 className="font-mono text-3xl font-extrabold tracking-tight text-slate-50">
              x402 router is the backbone.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-400">
              The existing x402 router handles payment execution and the paid-tool catalog.
              The Tab spend-control layer — budgets, policy engine, spend requests, and receipts — sits on top of that backbone.
            </p>
          </FadeUp>

          <div className="grid gap-3 sm:grid-cols-2">
            {[
              {
                label: "x402 router",
                tag: "Existing backbone",
                tagColor: "text-slate-500 border-slate-700",
                items: ["Payment execution", "Paid-tool catalog", "market-signal endpoint", "model-call endpoint", "x402 protocol"],
              },
              {
                label: "Tab spend layer",
                tag: "Tab spend layer",
                tagColor: "text-green-500 border-green-500/30",
                items: ["Budget enforcement", "Policy engine", "Spend requests", "Auto-approvals", "Cryptographic receipts", "Spend trace"],
              },
            ].map((col, i) => (
              <FadeUp key={col.label} delay={i * 0.1}>
                <div className="rounded-2xl border border-slate-700 bg-slate-900 p-5 h-full">
                  <div className="flex items-start justify-between gap-2 mb-4">
                    <p className="font-mono text-sm font-bold text-slate-200">{col.label}</p>
                    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest shrink-0 ${col.tagColor}`}>
                      {col.tag}
                    </span>
                  </div>
                  <ul className="space-y-2">
                    {col.items.map(item => (
                      <li key={item} className="flex items-center gap-2 text-xs text-slate-500">
                        <span className="h-1 w-1 rounded-full bg-slate-700 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── CTA ─────────────────────────────────────────────────────────────────────
function CTASection() {
  return (
    <section className="border-t border-slate-700/60 bg-slate-900 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 text-center">
        <FadeUp>
          <h2 className="font-mono text-4xl font-extrabold tracking-tight text-slate-50 sm:text-5xl">
            Give your agents a Tab.
          </h2>
          <p className="mt-4 text-lg text-slate-400">
            Budget enforcement, spend requests, approvals, and receipts — in one API call.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl bg-green-500 px-7 py-3.5 text-base font-bold text-slate-950 shadow-glow transition-all hover:bg-green-400"
            >
              Open a Tab <IconArrow />
            </Link>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="border-t border-slate-700/60 bg-slate-900 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-green-500 font-mono text-sm font-black text-slate-950">
              T
            </span>
            <span className="text-sm font-bold text-slate-50">Tab</span>
            <span className="text-slate-700 text-xs font-mono ml-2">— The spend layer for AI agents.</span>
          </div>
          <p className="text-xs text-slate-700 font-mono">Built on x402 · Base · 2026</p>
        </div>
      </div>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-900">
      <Nav />
      <HeroSection />
      <WorkflowSection />
      <DemoSection />
      <ComparisonSection />
      <ScopeSection />
      <CTASection />
      <Footer />
    </div>
  );
}
