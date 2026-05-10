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
    <header className="sticky top-0 z-50 border-b border-[#FFF8F2]/12 bg-[#241C19]/88 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        <button onClick={onNewRun} className="group flex cursor-pointer items-center gap-2.5 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-[#FF5848]/60" type="button">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold text-white shadow-[0_14px_30px_rgba(255,88,72,0.22)] transition-all group-hover:shadow-[0_18px_36px_rgba(255,88,72,0.34)]"
            style={{ background: "#FF5848" }}>
            T
          </span>
          <span className="hidden flex-col text-left sm:flex">
            <span className="text-sm font-semibold tracking-tight text-[#FFF8F2]">Tab</span>
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#FFF8F2]/42">
              spend layer
            </span>
          </span>
        </button>

        <nav className="hidden items-center sm:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="rounded-lg px-3 py-1.5 text-xs font-medium text-[#FFF8F2]/54 transition-colors hover:bg-[#FFF8F2]/8 hover:text-[#FFF8F2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5848]/50"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {userDisplay && (
            <span className="hidden text-xs text-[#FFF8F2]/56 sm:block">
              Welcome, <span className="font-semibold text-[#FFF8F2]">{userDisplay}</span>
            </span>
          )}
          <button
            onClick={signOut}
            className="hidden cursor-pointer rounded-md text-xs font-medium text-[#FFF8F2]/42 transition-colors hover:text-[#FF6A5D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5848]/50 sm:block"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
