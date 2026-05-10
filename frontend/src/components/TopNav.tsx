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
          <span className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold text-white transition-all group-hover:shadow-glow"
            style={{ background: "#FF5848" }}>
            T
          </span>
          <span className="hidden flex-col text-left sm:flex">
            <span className="text-sm font-semibold tracking-tight text-[#FFF8F2]">Tab</span>
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

        <div className="flex items-center gap-4">
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
        </div>
      </div>
    </header>
  );
}
