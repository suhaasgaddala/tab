import { motion } from "framer-motion";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import { supabase } from "../lib/supabaseClient"; // ← uncomment after Step 2

interface AuthPageProps {
  mode: "login" | "signup";
}

// ─── Left brand panel (desktop only) ─────────────────────────────────────────
function BrandPanel() {
  const points = [
    "Per-session budget enforcement",
    "Policy-based spend approval",
    "Cryptographic payment receipts",
    "Built on x402 · Link · Base",
  ];

  return (
    <div className="hidden lg:flex flex-col justify-between bg-slate-950 px-12 py-12 relative overflow-hidden">
      <div className="tab-grid-dark absolute inset-0" />
      <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-indigo-600/15 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-violet-600/10 blur-3xl" />

      <div className="relative">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 font-mono text-sm font-bold text-white">
            T
          </span>
          <span className="text-lg font-bold text-white">Tab</span>
        </Link>
      </div>

      <div className="relative space-y-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-3">
            Safety net for Link agents
          </p>
          <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-white">
            Financial guardrails for every AI agent your business deploys.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-400">
            Tab enforces budgets, approves spend requests, and records cryptographic
            receipts — so your team stays in control.
          </p>
        </div>

        <ul className="space-y-3">
          {points.map((pt) => (
            <li key={pt} className="flex items-center gap-3 text-sm text-slate-300">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 text-xs">
                ✓
              </span>
              {pt}
            </li>
          ))}
        </ul>
      </div>

      <p className="relative text-xs text-slate-600">© 2026 Tab · Built on x402</p>
    </div>
  );
}

// ─── Auth form ────────────────────────────────────────────────────────────────
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

      // Placeholder until Supabase is wired up:
      await new Promise((r) => setTimeout(r, 1000));
    }

    // ── LOGIN ─────────────────────────────────────────────────────────────────
    if (!isSignup) {
      // const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      // if (signInError) { setError(signInError.message); setLoading(false); return; }

      // Placeholder until Supabase is wired up:
      await new Promise((r) => setTimeout(r, 1000));
    }

    setLoading(false);
    navigate("/dashboard");
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition-colors focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20";

  return (
    <div className="flex flex-col justify-center px-6 py-12 sm:px-10 lg:px-16 xl:px-20">
      {/* Mobile logo */}
      <div className="mb-8 flex justify-center lg:hidden">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 font-mono text-sm font-bold text-white">
            T
          </span>
          <span className="text-lg font-bold text-slate-950">Tab</span>
        </Link>
      </div>

      <motion.div
        key={activeMode}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm mx-auto"
      >
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-950">
          {isSignup ? "Create your account" : "Welcome back"}
        </h1>
        <p className="mt-1.5 text-sm text-slate-500">
          {isSignup
            ? "Start securing your AI agent spend in minutes."
            : "Sign in to your Tab workspace."}
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          {isSignup && (
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                Company name
              </label>
              <input
                type="text"
                required
                placeholder="Acme Corp"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className={inputClass}
              />
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700">
              Work email
            </label>
            <input
              type="email"
              required
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700">
              Password
            </label>
            <input
              type="password"
              required
              placeholder={isSignup ? "Min. 8 characters" : "••••••••"}
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
            />
          </div>

          {isSignup && (
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                Confirm password
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={inputClass}
              />
            </div>
          )}

          {!isSignup && (
            <div className="flex justify-end">
              <a href="#" className="text-xs font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
                Forgot password?
              </a>
            </div>
          )}

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-700"
            >
              {error}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 text-sm font-semibold text-white shadow-md shadow-indigo-600/20 transition-colors hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                  className="h-4 w-4 rounded-full border-2 border-indigo-300 border-t-white"
                />
                {isSignup ? "Creating account..." : "Signing in..."}
              </>
            ) : (
              isSignup ? "Create account" : "Sign in"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="mt-6 flex items-center gap-3">
          <div className="flex-1 h-px bg-slate-200" />
          <span className="text-xs text-slate-400">or continue with</span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        {/* Google SSO placeholder */}
        <button
          type="button"
          onClick={() => {
            // supabase.auth.signInWithOAuth({
            //   provider: "google",
            //   options: { redirectTo: `${window.location.origin}/dashboard` },
            // });
          }}
          className="mt-4 flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-700 shadow-card transition-colors hover:bg-slate-50"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09Z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62Z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53Z" />
          </svg>
          Continue with Google
        </button>

        {/* Toggle login / signup */}
        <p className="mt-8 text-center text-sm text-slate-500">
          {isSignup ? "Already have an account? " : "Don't have an account? "}
          <button
            type="button"
            onClick={() => {
              setActiveMode(isSignup ? "login" : "signup");
              setError(null);
            }}
            className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors"
          >
            {isSignup ? "Sign in" : "Create one"}
          </button>
        </p>

        {isSignup && (
          <p className="mt-4 text-center text-xs text-slate-400">
            By creating an account you agree to our{" "}
            <a href="#" className="underline hover:text-slate-600">Terms of Service</a>{" "}
            and{" "}
            <a href="#" className="underline hover:text-slate-600">Privacy Policy</a>.
          </p>
        )}
      </motion.div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AuthPage({ mode }: AuthPageProps) {
  return (
    <div className="min-h-screen grid lg:grid-cols-[480px_1fr]">
      <BrandPanel />
      <AuthForm mode={mode} />
    </div>
  );
}
