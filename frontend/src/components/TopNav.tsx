import { Link } from "react-router-dom";

interface TopNavProps {
  onNewRun: () => void;
}

const NAV_LINKS = [
  { label: "Agent Run", href: "#goal" },
  { label: "Policy", href: "#policy" },
  { label: "Receipts", href: "#receipts" },
  { label: "Trace", href: "#answer" },
];

export function TopNav({ onNewRun }: TopNavProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800/80 bg-zinc-950/95 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        <button onClick={onNewRun} className="group flex items-center gap-2.5" type="button">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 font-mono text-sm font-black text-zinc-950 transition-all group-hover:shadow-[0_0_20px_rgba(245,158,11,0.4)]">
            T
          </span>
          <span className="hidden flex-col text-left sm:flex">
            <span className="text-sm font-bold tracking-tight text-zinc-50">Tab</span>
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-600">
              spend layer
            </span>
          </span>
        </button>

        <nav className="hidden items-center sm:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="rounded-lg px-3 py-1.5 text-xs font-medium text-zinc-500 transition-colors hover:bg-zinc-900 hover:text-zinc-200"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="hidden text-xs font-medium text-zinc-600 transition-colors hover:text-zinc-300 sm:block"
          >
            ← Home
          </Link>
          <button
            onClick={onNewRun}
            className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3.5 py-1.5 text-xs font-bold text-amber-400 transition-all hover:border-amber-500/50 hover:bg-amber-500/20"
          >
            Open a Tab
          </button>
        </div>
      </div>
    </header>
  );
}
