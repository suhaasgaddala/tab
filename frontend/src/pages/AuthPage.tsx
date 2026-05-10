import { motion } from "framer-motion";
import { ArrowLeft, BadgeCheck, Building2, CheckCircle2, FileCheck2, KeyRound, LockKeyhole, Mail, ReceiptText, ShieldCheck, Sparkles } from "lucide-react";
import { type FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

interface AuthPageProps {
  mode: "login" | "signup";
}

const previewCards = [
  { label: "Budget policy", value: "$0.050 cap", Icon: ShieldCheck },
  { label: "Auto-approved", value: "market-signal", Icon: BadgeCheck },
  { label: "Receipt written", value: "apr_1N4...9k1", Icon: ReceiptText },
];

function AuthVisualPanel() {
  return (
    <aside className="relative min-h-[420px] overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,#FF5848_0%,#FF6A5D_38%,#F0B28C_100%)] p-8 text-white shadow-[0_28px_90px_rgba(255,88,72,0.28)] lg:min-h-0 lg:p-12">
      <div className="pointer-events-none absolute inset-x-12 top-20 h-px bg-white/24" />
      <motion.div
        className="pointer-events-none absolute -right-20 top-16 h-64 w-64 rounded-full bg-[radial-gradient(circle_at_35%_28%,rgba(255,248,242,0.45),rgba(255,106,93,0.3)_42%,rgba(173,58,43,0.18)_70%)] shadow-[inset_20px_16px_42px_rgba(255,248,242,0.22),0_28px_80px_rgba(80,26,20,0.22)]"
        animate={{ y: [0, -12, 0], rotate: [0, 2, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute bottom-[-80px] left-[16%] h-80 w-80 rounded-full border-[18px] border-white/16"
        animate={{ y: [0, 14, 0], x: [0, 8, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute right-[18%] top-[30%] h-72 w-72 rounded-full border-[34px] border-[#0E4A43]/18"
        animate={{ rotate: [0, -4, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute bottom-24 right-8 h-44 w-44 rounded-full bg-[#0E4A43]/18 blur-2xl"
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 flex h-full flex-col justify-between gap-12">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/24 bg-white/14 px-4 py-2 text-xs font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16)] backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5" />
            Agent spend
          </span>
          <h2 className="mt-8 max-w-xl text-[clamp(2.8rem,4.6vw,5.75rem)] font-semibold leading-[0.97] tracking-[-0.075em]">
            The spend layer for AI agents.
          </h2>
          <p className="mt-5 max-w-md text-lg leading-8 text-white/78">
            Budgets, approvals, and receipts for every autonomous tool call.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
          {previewCards.map(({ label, value, Icon }, index) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28 + index * 0.08, duration: 0.48 }}
              className="rounded-2xl border border-white/20 bg-white/18 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.16)] backdrop-blur-xl"
            >
              <Icon className="h-5 w-5 text-white" strokeWidth={1.9} />
              <p className="mt-3 text-xs font-semibold text-white/72">{label}</p>
              <p className="mt-1 font-mono text-sm font-bold text-white">{value}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </aside>
  );
}

function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const navigate = useNavigate();
  const [activeMode, setActiveMode] = useState<"login" | "signup">(mode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [company, setCompany] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isSignup = activeMode === "signup";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (isSignup && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    // ── SIGNUP ────────────────────────────────────────────────────────────────
    if (isSignup) {
      // const { error: signUpError } = await supabase.auth.signUp({
      //   email,
      //   password,
      //   options: { data: { company_name: company } },
      // });
      // if (signUpError) { setError(signUpError.message); setLoading(false); return; }
      await new Promise((r) => setTimeout(r, 900));
    }

    // ── LOGIN ─────────────────────────────────────────────────────────────────
    if (!isSignup) {
      // const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      // if (signInError) { setError(signInError.message); setLoading(false); return; }
      await new Promise((r) => setTimeout(r, 900));
    }

    // ── Set session flag (replace with Supabase session when wired up) ────────
    localStorage.setItem("tab_authed", "true");
    localStorage.setItem("tab_user_email", email);

    setLoading(false);
    navigate("/dashboard");
  };

  const inputBase =
    "h-14 w-full rounded-2xl border border-[#241C19]/8 bg-[#241C19]/[0.035] pl-12 pr-4 text-sm font-medium text-[#241C19] outline-none transition-all placeholder:text-[#241C19]/34 focus:border-[#FF5848]/60 focus:bg-white focus:ring-4 focus:ring-[#FF5848]/10";

  return (
    <section className="flex min-h-[calc(100vh-2rem)] flex-col rounded-[2rem] bg-[#FFF8F2] p-6 text-[#241C19] shadow-[0_24px_80px_rgba(36,28,25,0.08)] sm:p-10 lg:min-h-0 lg:rounded-none lg:bg-white lg:shadow-none xl:p-14">
      <header className="flex items-center justify-between gap-4">
        <Link
          to="/"
          className="rounded-xl text-[2.4rem] font-semibold leading-none tracking-[-0.07em] text-[#FF5848] outline-none transition-opacity hover:opacity-75 focus-visible:ring-2 focus-visible:ring-[#FF5848]/40"
        >
          Tab
        </Link>
        <span className="inline-flex items-center gap-2 rounded-full bg-[#FFF0EC] px-4 py-2 text-xs font-semibold text-[#241C19]/72">
          <CheckCircle2 className="h-3.5 w-3.5 text-[#FF5848]" />
          Base Sepolia
        </span>
      </header>

      <div className="flex flex-1 items-center py-12">
        <motion.div
          key={activeMode}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto w-full max-w-[520px]"
        >
          <Link
            to="/"
            className="mb-10 inline-flex items-center gap-2 rounded-full text-sm font-semibold text-[#241C19]/48 outline-none transition-colors hover:text-[#FF5848] focus-visible:ring-2 focus-visible:ring-[#FF5848]/40"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to landing
          </Link>

          <h1 className="text-[clamp(3rem,5.4vw,4.8rem)] font-semibold leading-[0.98] tracking-[-0.075em] text-[#080604]">
            {isSignup ? "Create your Tab account" : "Sign in"}
          </h1>
          <p className="mt-4 text-lg leading-7 text-[#241C19]/56">
            {isSignup ? "Start securing AI agent spend in minutes." : "Return to your agent spend dashboard."}
          </p>

          <form onSubmit={handleSubmit} className="mt-10 space-y-5">
            {isSignup && (
              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-[#241C19]/42">Company name</span>
                <span className="relative block">
                  <Building2 className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#241C19]/48" />
                  <input
                    type="text"
                    required
                    placeholder="Acme AI Lab"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className={inputBase}
                  />
                </span>
              </label>
            )}

            <label className="block">
              <span className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-[#241C19]/42">Work email</span>
              <span className="relative block">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#241C19]/48" />
                <input
                  type="email"
                  required
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputBase}
                />
              </span>
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-[#241C19]/42">Password</span>
              <span className="relative block">
                <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#241C19]/48" />
                <input
                  type="password"
                  required
                  placeholder={isSignup ? "Min. 8 characters" : "Password"}
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputBase}
                />
              </span>
            </label>

            {isSignup && (
              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-[#241C19]/42">Confirm password</span>
                <span className="relative block">
                  <KeyRound className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#241C19]/48" />
                  <input
                    type="password"
                    required
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={inputBase}
                  />
                </span>
              </label>
            )}

            {!isSignup && (
              <div className="flex justify-end">
                <a href="#top" className="rounded-md text-sm font-semibold text-[#FF5848] outline-none transition-opacity hover:opacity-75 focus-visible:ring-2 focus-visible:ring-[#FF5848]/40">
                  Forgot password?
                </a>
              </div>
            )}

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-red-500/20 bg-red-500/8 px-4 py-3 text-sm font-semibold text-red-600"
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group flex h-14 w-full cursor-pointer items-center justify-center gap-3 rounded-2xl bg-[#FF5848] px-6 text-base font-semibold text-white shadow-[0_18px_42px_rgba(255,88,72,0.26)] outline-none transition-all hover:bg-[#F05A4A] focus-visible:ring-4 focus-visible:ring-[#FF5848]/24 disabled:cursor-not-allowed disabled:opacity-55"
            >
              {loading ? (
                <>
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                    className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white"
                  />
                  {isSignup ? "Creating account..." : "Signing in..."}
                </>
              ) : (
                isSignup ? "Create account" : "Log in"
              )}
            </button>
          </form>

          <div className="mt-7 rounded-2xl border border-[#241C19]/8 bg-white/72 p-4">
            <div className="flex items-start gap-3">
              <FileCheck2 className="mt-0.5 h-5 w-5 shrink-0 text-[#FF5848]" />
              <p className="text-sm leading-6 text-[#241C19]/58">
                Tab records budget decisions and receipts so agent spend stays auditable.
              </p>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-[#241C19]/52">
            {isSignup ? "Already have an account? " : "Don't have an account? "}
            <button
              type="button"
              onClick={() => {
                setActiveMode(isSignup ? "login" : "signup");
                setError(null);
              }}
              className="cursor-pointer rounded-md font-semibold text-[#FF5848] outline-none transition-opacity hover:opacity-75 focus-visible:ring-2 focus-visible:ring-[#FF5848]/40"
            >
              {isSignup ? "Sign in" : "Sign up"}
            </button>
          </p>
        </motion.div>
      </div>

      <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-[#241C19]/8 pt-5 text-xs font-medium text-[#241C19]/42">
        <span>© 2026 Tab</span>
        <span className="flex gap-3">
          <a href="#top" className="rounded-md outline-none transition-colors hover:text-[#FF5848] focus-visible:ring-2 focus-visible:ring-[#FF5848]/40">
            Privacy
          </a>
          <a href="#top" className="rounded-md outline-none transition-colors hover:text-[#FF5848] focus-visible:ring-2 focus-visible:ring-[#FF5848]/40">
            Terms
          </a>
        </span>
      </footer>
    </section>
  );
}

export default function AuthPage({ mode }: AuthPageProps) {
  return (
    <div id="top" className="min-h-screen bg-[#FFF8F2] p-4 lg:grid lg:grid-cols-[minmax(420px,0.48fr)_minmax(0,0.72fr)] lg:gap-4">
      <AuthForm mode={mode} />
      <AuthVisualPanel />
    </div>
  );
}
