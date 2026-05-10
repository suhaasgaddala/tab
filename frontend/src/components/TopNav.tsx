import { useNavigate } from "react-router-dom";

interface TopNavProps {
  onNewRun: () => void;
}

const NAV_LINKS = [
  { label: "Agent Run", href: "#goal" },
  { label: "Policy", href: "#policy" },
  { label: "Receipts", href: "#receipts" },
  { label: "Trace", href: "#answer" },
];

function getUserDisplay(): string {
  // Replace with: (await supabase.auth.getUser()).data.user?.email ?? ""
  const email = localStorage.getItem("tab_user_email") ?? "";
  return email.split("@")[0] || email;
}

export function TopNav({ onNewRun }: TopNavProps) {
  const navigate = useNavigate();
  const userDisplay = getUserDisplay();

  const signOut = () => {
    // await supabase.auth.signOut();
    localStorage.removeItem("tab_authed");
    localStorage.removeItem("tab_user_email");
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-700/60 bg-slate-900/95 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        <button onClick={onNewRun} className="group flex items-center gap-2.5 cursor-pointer" type="button">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500 font-mono text-sm font-black text-slate-950 transition-all group-hover:shadow-[0_0_20px_rgba(34,197,94,0.4)]">
            T
          </span>
          <span className="hidden flex-col text-left sm:flex">
            <span className="text-sm font-bold tracking-tight text-slate-50">Tab</span>
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-slate-500">
              spend layer
            </span>
          </span>
        </button>

        <nav className="hidden items-center sm:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-800 hover:text-slate-200"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {userDisplay && (
            <span className="hidden text-xs text-slate-400 sm:block">
              Welcome, <span className="font-semibold text-slate-200">{userDisplay}</span>
            </span>
          )}
          <button
            onClick={signOut}
            className="hidden text-xs font-medium text-slate-600 transition-colors hover:text-slate-300 sm:block cursor-pointer"
          >
            Sign out
          </button>
          <button
            onClick={onNewRun}
            className="rounded-lg border border-green-500/30 bg-green-500/10 px-3.5 py-1.5 text-xs font-bold text-green-400 transition-all hover:border-green-500/50 hover:bg-green-500/20 cursor-pointer"
          >
            Open a Tab
          </button>
        </div>
      </div>
    </header>
  );
}
