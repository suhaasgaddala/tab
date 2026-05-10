import { motion } from "framer-motion";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

interface AuthPageProps {
  mode: "login" | "signup";
}

function BrandPanel() {
  const points = [
    "Per-session budget enforcement",
    "Policy-based spend approval",
    "Cryptographic payment receipts",
    "Built on x402 · Base",
  ];

  return (
    <div className="hidden lg:flex flex-col justify-between bg-slate-900 px-12 py-12 relative overflow-hidden border-r border-slate-700/60">
      <div className="tab-grid absolute inset-0 opacity-50" />
      <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-green-500/5 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-green-500/4 blur-3xl" />

      <div className="relative">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-500 font-mono text-sm font-black text-slate-950 shadow-glow">
            T
          </span>
          <span className="text-lg font-bold text-slate-50">Tab</span>
        </Link>
      </div>

      <div className="relative space-y-8">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-green-400 mb-3">
            The spend layer for AI agents
          </p>
          <h2 className="font-mono text-3xl font-extrabold leading-tight tracking-tight text-slate-50">
            Budgets, spend requests, approvals, and receipts for every agent run.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-slate-400">
            Tab enforces budgets, approves spend requests, and records cryptographic
            receipts — giving teams full control over agent spend.
          </p>
        </div>

        <ul className="space-y-3">
          {points.map((pt) => (
            <li key={pt} className="flex items-center gap-3 text-sm text-slate-300">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs">
                ✓
              </span>
              {pt}
            </li>
          ))}
        </ul>
      </div>

      <p className="relative text-xs text-slate-700 font-mono">© 2026 Tab · Built on x402</p>
    </div>
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

  const handleSubmit = async (e: React.FormEvent) => {
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

  const inputClass =
    "w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-100 placeholder-slate-600 outline-none transition-all focus:border-green-500/50 focus:ring-2 focus:ring-green-500/10";

  return (
    <div className="relative flex flex-col justify-center bg-slate-800 px-6 py-12 sm:px-10 lg:px-16 xl:px-20">
      {/* Back to landing */}
      <div className="absolute top-5 right-5">
        <Link
          to="/"
          className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-400 transition-all hover:border-slate-600 hover:text-slate-200"
        >
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </Link>
      </div>

      {/* Mobile logo */}
      <div className="mb-8 flex justify-center lg:hidden">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-500 font-mono text-sm font-black text-slate-950 shadow-glow">
            T
          </span>
          <span className="text-lg font-bold text-slate-50">Tab</span>
        </Link>
      </div>

      <motion.div
        key={activeMode}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm mx-auto"
      >
        <h1 className="font-mono text-2xl font-extrabold tracking-tight text-slate-50">
          {isSignup ? "Create your account" : "Welcome back"}
        </h1>
        <p className="mt-1.5 text-sm text-slate-500">
          {isSignup ? "Start securing your AI agent spend in minutes." : "Sign in to your Tab workspace."}
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          {isSignup && (
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-400">Company name</label>
              <input type="text" required placeholder="Acme Corp" value={company}
                onChange={e => setCompany(e.target.value)} className={inputClass} />
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-400">Work email</label>
            <input type="email" required placeholder="you@company.com" value={email}
              onChange={e => setEmail(e.target.value)} className={inputClass} />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-400">Password</label>
            <input type="password" required placeholder={isSignup ? "Min. 8 characters" : "••••••••"}
              minLength={8} value={password} onChange={e => setPassword(e.target.value)} className={inputClass} />
          </div>

          {isSignup && (
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-400">Confirm password</label>
              <input type="password" required placeholder="••••••••" value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)} className={inputClass} />
            </div>
          )}

          {!isSignup && (
            <div className="flex justify-end">
              <a href="#" className="text-xs font-semibold text-green-500 hover:text-green-400 transition-colors">
                Forgot password?
              </a>
            </div>
          )}

          {error && (
            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-red-500/20 bg-red-500/8 px-3 py-2 text-xs text-red-400">
              {error}
            </motion.p>
          )}

          <button type="submit" disabled={loading}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-green-500 py-3.5 text-sm font-bold text-slate-950 shadow-glow transition-all hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
            {loading ? (
              <>
                <motion.span animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                  className="h-4 w-4 rounded-full border-2 border-green-800 border-t-slate-950" />
                {isSignup ? "Creating account..." : "Signing in..."}
              </>
            ) : (
              isSignup ? "Create account" : "Sign in"
            )}
          </button>
        </form>

        <div className="mt-6 flex items-center gap-3">
          <div className="flex-1 h-px bg-slate-700" />
          <span className="text-xs text-slate-600">or continue with</span>
          <div className="flex-1 h-px bg-slate-700" />
        </div>

        <button type="button"
          className="mt-4 flex w-full items-center justify-center gap-3 rounded-xl border border-slate-700 bg-slate-900 py-3 text-sm font-semibold text-slate-300 transition-all hover:border-slate-600 hover:bg-slate-800 cursor-pointer">
          <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09Z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62Z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53Z" />
          </svg>
          Continue with Google
        </button>

        <p className="mt-8 text-center text-sm text-slate-500">
          {isSignup ? "Already have an account? " : "Don't have an account? "}
          <button type="button"
            onClick={() => { setActiveMode(isSignup ? "login" : "signup"); setError(null); }}
            className="font-semibold text-green-500 hover:text-green-400 transition-colors cursor-pointer">
            {isSignup ? "Sign in" : "Create one"}
          </button>
        </p>

        {isSignup && (
          <p className="mt-4 text-center text-xs text-slate-600">
            By creating an account you agree to our{" "}
            <a href="#" className="underline hover:text-slate-400">Terms of Service</a>{" "}
            and{" "}
            <a href="#" className="underline hover:text-slate-400">Privacy Policy</a>.
          </p>
        )}
      </motion.div>
    </div>
  );
}

export default function AuthPage({ mode }: AuthPageProps) {
  return (
    <div className="min-h-screen grid lg:grid-cols-[480px_1fr]">
      <BrandPanel />
      <AuthForm mode={mode} />
    </div>
  );
}
