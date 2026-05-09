import { AnimatePresence, motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

// ─── Scroll-reveal wrapper ────────────────────────────────────────────────────
function FadeUp({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

// ─── Inline SVG icons ─────────────────────────────────────────────────────────
function IconShield() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.955 11.955 0 0 1 3 10c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.249-8.25-3.286Z" />
    </svg>
  );
}
function IconCheck() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  );
}
function IconReceipt() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25Z" />
    </svg>
  );
}
function IconBell() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
    </svg>
  );
}
function IconUsers() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
    </svg>
  );
}
function IconLock() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
    </svg>
  );
}
function IconArrow() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
    </svg>
  );
}

// ─── Sticky nav ───────────────────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <span
            className={`flex h-8 w-8 items-center justify-center rounded-lg font-mono text-sm font-bold text-white shadow-card transition-colors ${
              scrolled ? "bg-indigo-600" : "bg-indigo-500"
            }`}
          >
            T
          </span>
          <span
            className={`text-base font-bold tracking-tight transition-colors ${
              scrolled ? "text-slate-950" : "text-white"
            }`}
          >
            Tab
          </span>
        </Link>

        <div className="hidden items-center gap-8 text-sm font-medium md:flex">
          {[["Features", "#features"], ["How it works", "#how-it-works"], ["Enterprise", "#enterprise"]].map(
            ([label, href]) => (
              <a
                key={label}
                href={href}
                className={`transition-colors ${
                  scrolled ? "text-slate-600 hover:text-slate-950" : "text-slate-300 hover:text-white"
                }`}
              >
                {label}
              </a>
            )
          )}
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className={`hidden text-sm font-medium transition-colors sm:block px-3 py-2 rounded-lg ${
              scrolled
                ? "text-slate-600 hover:text-slate-950"
                : "text-slate-300 hover:text-white"
            }`}
          >
            Sign in
          </Link>
          <Link
            to="/signup"
            className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-500"
          >
            Get started <IconArrow />
          </Link>
        </div>
      </div>
    </nav>
  );
}

// ─── Hero animated spend-card mock ───────────────────────────────────────────
function HeroCard() {
  const [step, setStep] = useState<"pending" | "approved" | "receipt">("pending");

  useEffect(() => {
    const t1 = setTimeout(() => setStep("approved"), 2200);
    const t2 = setTimeout(() => setStep("receipt"), 3400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div className="w-full max-w-sm mx-auto lg:mx-0 lg:ml-auto">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.7, ease: "easeOut" }}
        className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-[0_32px_80px_rgba(0,0,0,0.5)]"
      >
        {/* Card header */}
        <div className="flex items-center gap-3 border-b border-slate-800 px-5 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-indigo-500/30 bg-indigo-500/15">
            <span className="text-xs font-bold text-indigo-400">AI</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-white">Research Agent</p>
            <p className="text-xs text-slate-400">via Link · spend request</p>
          </div>
          <AnimatePresence mode="wait">
            {step === "pending" && (
              <motion.span key="p" exit={{ opacity: 0 }} className="rounded-full bg-amber-500/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-amber-400">
                Pending
              </motion.span>
            )}
            {step !== "pending" && (
              <motion.span key="a" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                Approved
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Card rows */}
        <div className="divide-y divide-slate-800/60 px-5">
          {[
            ["Tool", "market-signal", false],
            ["Provider", "DexScreener", false],
            ["Category", "market-data", false],
            ["Amount", "$0.020", true],
            ["Budget remaining", "$0.030", false],
          ].map(([label, value, highlight]) => (
            <div key={label as string} className="flex items-center justify-between py-3">
              <span className="text-xs text-slate-500">{label as string}</span>
              <span className={`font-mono text-xs font-semibold ${highlight ? "text-amber-400" : "text-slate-200"}`}>
                {value as string}
              </span>
            </div>
          ))}
        </div>

        {/* Status row */}
        <div className="px-5 pb-4 pt-1">
          <AnimatePresence mode="wait">
            {step === "pending" && (
              <motion.div key="eval" exit={{ opacity: 0 }} className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2.5">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="h-3.5 w-3.5 rounded-full border-2 border-slate-600 border-t-indigo-400"
                />
                <span className="text-xs text-slate-400">Evaluating policy...</span>
              </motion.div>
            )}
            {step !== "pending" && (
              <motion.div key="ok" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2.5">
                <span className="text-sm text-emerald-400">✓</span>
                <span className="text-xs font-semibold text-emerald-400">Policy approved</span>
                <span className="ml-auto text-xs text-emerald-700">within-budget</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Receipt chip */}
      <AnimatePresence>
        {step === "receipt" && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-3 flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900 px-4 py-3"
          >
            <span className="text-xs font-bold text-emerald-400">✓ RECEIPT</span>
            <span className="text-xs text-slate-500">market-signal · $0.020 · x402 · base-sepolia</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Budget bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-3 rounded-xl border border-slate-800 bg-slate-900 px-4 py-3"
      >
        <div className="flex justify-between text-xs mb-1.5">
          <span className="text-slate-500">Session budget</span>
          <span className="font-mono text-slate-300">$0.020 / $0.050</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: step === "pending" ? "0%" : "40%" }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="h-full rounded-full bg-indigo-500"
          />
        </div>
      </motion.div>
    </div>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-slate-950">
      <div className="tab-grid-dark absolute inset-0" />
      <div className="absolute -left-48 -top-48 h-[600px] w-[600px] rounded-full bg-indigo-600/10 blur-3xl" />
      <div className="absolute -bottom-32 right-[-8rem] h-[500px] w-[500px] rounded-full bg-violet-600/8 blur-3xl" />

      <div className="relative mx-auto w-full max-w-7xl px-4 pb-16 pt-28 sm:px-6">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          {/* Left: copy */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1.5"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse-slow" />
              <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-indigo-400">
                Safety net for Link agents
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="text-5xl font-extrabold leading-[1.06] tracking-tight text-white sm:text-6xl lg:text-7xl"
            >
              The financial{" "}
              <span className="text-indigo-400">guardrail</span>
              <br />
              every AI agent
              <br />
              needs.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.2 }}
              className="mt-6 max-w-xl text-lg leading-relaxed text-slate-400"
            >
              Tab sits on top of Link — giving your business real-time budget
              enforcement, policy-based spend approval, and cryptographic receipts
              for every dollar your AI agents spend.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.3 }}
              className="mt-10 flex flex-wrap gap-4"
            >
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-indigo-600/25 transition-colors hover:bg-indigo-500"
              >
                Start free trial <IconArrow />
              </Link>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-6 py-3.5 text-base font-semibold text-slate-300 transition-colors hover:border-slate-500 hover:text-white"
              >
                See the demo
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-12 flex flex-wrap items-center gap-10"
            >
              {[
                ["100%", "Policy coverage"],
                ["<1ms", "Approval latency"],
                ["x402", "Payment rail"],
              ].map(([val, label]) => (
                <div key={label}>
                  <p className="text-2xl font-extrabold text-white">{val}</p>
                  <p className="mt-0.5 text-sm text-slate-500">{label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: card mock */}
          <div className="hidden lg:block">
            <HeroCard />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Problem section ──────────────────────────────────────────────────────────
function ProblemSection() {
  const pains = [
    {
      icon: "👁️",
      title: "Zero visibility",
      body: "Agents make purchases silently. You have no idea what they're buying until the invoice arrives.",
    },
    {
      icon: "💸",
      title: "No hard limits",
      body: "Without budget caps, a single runaway agent session can drain your entire Link balance in minutes.",
    },
    {
      icon: "📋",
      title: "No audit trail",
      body: "Finance and compliance teams need receipts. Agents leave no paper trail by default.",
    },
  ];

  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <FadeUp>
          <p className="mb-4 text-sm font-bold uppercase tracking-widest text-indigo-600">The problem</p>
          <h2 className="max-w-2xl text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">
            AI agents are spending your money without guardrails.
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-500">
            Link gives your agents the power to make payments on your behalf.
            Power without control is a liability — especially at scale.
          </p>
        </FadeUp>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {pains.map((p, i) => (
            <FadeUp key={p.title} delay={i * 0.1}>
              <div className="group rounded-2xl border border-slate-200 bg-slate-50 p-7 transition-colors hover:border-slate-300 hover:bg-white hover:shadow-card">
                <div className="mb-5 text-3xl">{p.icon}</div>
                <h3 className="mb-2 text-lg font-bold text-slate-950">{p.title}</h3>
                <p className="text-sm leading-relaxed text-slate-500">{p.body}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Features section ─────────────────────────────────────────────────────────
function FeaturesSection() {
  const features = [
    {
      icon: <IconShield />,
      color: "text-indigo-600 bg-indigo-50",
      title: "Budget enforcement",
      body: "Set hard per-session spending limits. Tab's policy engine blocks any call that would push the agent over budget — automatically, before the payment is attempted.",
      tags: ["Per-session caps", "Per-agent limits", "Global org ceiling"],
    },
    {
      icon: <IconCheck />,
      color: "text-emerald-600 bg-emerald-50",
      title: "Spend request approval",
      body: "Every transaction is evaluated against your policy rules before execution. Approve automatically for low-risk calls, or require manual sign-off for high-value purchases.",
      tags: ["Policy engine", "Manual override", "Webhook alerts"],
    },
    {
      icon: <IconReceipt />,
      color: "text-violet-600 bg-violet-50",
      title: "Cryptographic receipts",
      body: "Tab records tamper-proof receipts for every approved payment — provider, amount, rail, network, and timestamp — giving your finance team an audit-ready ledger by default.",
      tags: ["x402 rail", "Base Sepolia", "Exportable CSV"],
    },
  ];

  return (
    <section id="features" className="bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <FadeUp>
          <p className="mb-4 text-sm font-bold uppercase tracking-widest text-indigo-600">Features</p>
          <h2 className="max-w-2xl text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">
            Complete control over every dollar your agents spend.
          </h2>
        </FadeUp>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {features.map((f, i) => (
            <FadeUp key={f.title} delay={i * 0.1}>
              <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-7 shadow-card">
                <div className={`mb-5 flex h-11 w-11 items-center justify-center rounded-xl ${f.color}`}>
                  {f.icon}
                </div>
                <h3 className="mb-3 text-lg font-bold text-slate-950">{f.title}</h3>
                <p className="mb-6 flex-1 text-sm leading-relaxed text-slate-500">{f.body}</p>
                <div className="flex flex-wrap gap-2">
                  {f.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── How it works ─────────────────────────────────────────────────────────────
function HowItWorksSection() {
  const steps = [
    {
      num: "01",
      title: "Connect your Link agents",
      body: "Point your existing Link-powered agents at Tab's spend layer with a single API change. No agent code rewrites needed — Tab wraps the payment flow transparently.",
      aside: (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card font-mono text-xs text-slate-600">
          <p className="text-slate-400 mb-2">{"// tab.config.ts"}</p>
          <p><span className="text-indigo-600">export</span> <span className="text-indigo-600">const</span> tabConfig = {"{"}</p>
          <p className="pl-4">apiKey: <span className="text-emerald-600">process.env.TAB_KEY</span>,</p>
          <p className="pl-4">linkAgentId: <span className="text-amber-600">"agt_xyz"</span>,</p>
          <p className="pl-4">budgetUsd: <span className="text-violet-600">0.05</span>,</p>
          <p>{"}"}</p>
        </div>
      ),
    },
    {
      num: "02",
      title: "Configure budgets and policies",
      body: "Set per-session spend limits, define approval rules for different tool categories, and configure webhook alerts for your team — all from your Tab dashboard.",
      aside: (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
          <div className="space-y-3">
            {[
              { label: "Session budget", val: "$0.050", color: "bg-indigo-100 text-indigo-700" },
              { label: "market-data calls", val: "Auto-approve", color: "bg-emerald-100 text-emerald-700" },
              { label: "inference calls", val: "Auto-approve", color: "bg-emerald-100 text-emerald-700" },
              { label: "external API calls", val: "Manual review", color: "bg-amber-100 text-amber-700" },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between">
                <span className="text-xs text-slate-600">{row.label}</span>
                <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${row.color}`}>{row.val}</span>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      num: "03",
      title: "Monitor and audit in real time",
      body: "Every spend request, approval decision, and receipt is captured in your Tab ledger — queryable by agent, time range, or tool category. Export any time for finance review.",
      aside: (
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-card">
          <div className="px-4 py-3 border-b border-slate-100">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Receipt ledger</p>
          </div>
          <div className="divide-y divide-slate-100">
            {[
              ["market-signal", "$0.020", "✓"],
              ["model-call", "$0.001", "✓"],
              ["market-signal", "$0.020", "✓"],
            ].map(([tool, amt, status], i) => (
              <div key={i} className="flex items-center justify-between px-4 py-2.5 text-xs">
                <span className="font-mono text-slate-700">{tool}</span>
                <span className="text-amber-700 font-mono font-semibold">{amt}</span>
                <span className="text-emerald-600 font-bold">{status} x402</span>
              </div>
            ))}
          </div>
        </div>
      ),
    },
  ];

  return (
    <section id="how-it-works" className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <FadeUp>
          <p className="mb-4 text-sm font-bold uppercase tracking-widest text-indigo-600">How it works</p>
          <h2 className="max-w-2xl text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">
            From deployment to audit in minutes.
          </h2>
        </FadeUp>

        <div className="mt-16 space-y-20">
          {steps.map((step, i) => (
            <FadeUp key={step.num} delay={0.05}>
              <div className={`grid items-center gap-12 lg:grid-cols-2 ${i % 2 === 1 ? "lg:grid-flow-dense" : ""}`}>
                <div className={i % 2 === 1 ? "lg:col-start-2" : ""}>
                  <p className="mb-3 font-mono text-5xl font-extrabold text-slate-100">{step.num}</p>
                  <h3 className="mb-4 text-2xl font-bold tracking-tight text-slate-950">{step.title}</h3>
                  <p className="text-base leading-relaxed text-slate-500">{step.body}</p>
                </div>
                <div className={i % 2 === 1 ? "lg:col-start-1 lg:row-start-1" : ""}>{step.aside}</div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Enterprise section ───────────────────────────────────────────────────────
function EnterpriseSection() {
  const bullets = [
    { icon: <IconLock />, text: "SSO and role-based access control" },
    { icon: <IconBell />, text: "Webhook and Slack spend alerts" },
    { icon: <IconUsers />, text: "Multi-team workspace support" },
    { icon: <IconReceipt />, text: "SOC 2-ready audit exports" },
  ];

  return (
    <section id="enterprise" className="bg-slate-950 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <FadeUp>
            <p className="mb-4 text-sm font-bold uppercase tracking-widest text-indigo-400">Built for business</p>
            <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              Enterprise-grade controls for teams running AI at scale.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-slate-400">
              Whether you're running one agent or a thousand, Tab's policy engine and audit infrastructure
              adapt to your organization's security and compliance requirements.
            </p>
            <div className="mt-10">
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-indigo-500"
              >
                Talk to us <IconArrow />
              </Link>
            </div>
          </FadeUp>

          <FadeUp delay={0.15}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {bullets.map((b) => (
                <div key={b.text} className="flex items-start gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-400">
                    {b.icon}
                  </div>
                  <p className="text-sm font-medium leading-snug text-slate-300">{b.text}</p>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

// ─── CTA ──────────────────────────────────────────────────────────────────────
function CTASection() {
  return (
    <section className="bg-indigo-600 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 text-center">
        <FadeUp>
          <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Ready to secure your agent spend?
          </h2>
          <p className="mt-4 text-lg text-indigo-200">
            Join forward-thinking businesses already using Tab to manage their Link agents.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-base font-semibold text-indigo-700 shadow-lg transition-colors hover:bg-indigo-50"
            >
              Start free trial <IconArrow />
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl border border-indigo-400 px-7 py-3.5 text-base font-semibold text-white transition-colors hover:border-indigo-300 hover:bg-indigo-500"
            >
              See live demo
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
    <footer className="border-t border-slate-800 bg-slate-950 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 font-mono text-sm font-bold text-white">
                T
              </span>
              <span className="text-base font-bold text-white">Tab</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-500 max-w-xs">
              The spend control layer for AI agents running on Link. Budget enforcement, spend approval, and cryptographic receipts.
            </p>
          </div>

          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-500">Product</p>
            <ul className="space-y-3">
              {["Features", "How it works", "Enterprise", "Demo"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-slate-400 transition-colors hover:text-white">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-500">Company</p>
            <ul className="space-y-3">
              {["About", "Privacy", "Terms", "Contact"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-slate-400 transition-colors hover:text-white">{link}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-8 sm:flex-row">
          <p className="text-xs text-slate-600">© 2026 Tab. Built on x402 · Link · Base.</p>
          <p className="text-xs text-slate-600">The safety net for agentic payments.</p>
        </div>
      </div>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Nav />
      <HeroSection />
      <ProblemSection />
      <FeaturesSection />
      <HowItWorksSection />
      <EnterpriseSection />
      <CTASection />
      <Footer />
    </div>
  );
}
