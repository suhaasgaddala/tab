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
        <button
          onClick={() => {
            onNewRun();
            navigate("/dashboard");
          }}
          className="group flex cursor-pointer items-baseline gap-3 rounded-xl outline-none transition-opacity hover:opacity-85 focus-visible:ring-2 focus-visible:ring-[#FF5848]/60"
          type="button"
          aria-label="Tab dashboard home"
        >
          <span className="text-[2rem] font-semibold leading-none tracking-[-0.07em] text-[#FFF8F2]">
            Tab
          </span>
          <span className="hidden text-[10px] font-semibold uppercase tracking-[0.18em] text-[#FFF8F2]/42 sm:inline">
            Spend layer
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
