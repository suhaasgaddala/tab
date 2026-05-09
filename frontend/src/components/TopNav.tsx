import { Link } from "react-router-dom";

interface TopNavProps {
  onNewRun: () => void;
}

export function TopNav({ onNewRun }: TopNavProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        <button onClick={onNewRun} className="flex items-center gap-2.5 group" type="button">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 font-mono text-sm font-black text-zinc-950 shadow-glow transition-shadow group-hover:shadow-[0_0_24px_rgba(245,158,11,0.35)]">
            T
          </span>
          <span className="flex flex-col text-left">
            <span className="text-sm font-bold tracking-tight text-zinc-50">Tab</span>
            <span className="hidden text-[10px] uppercase tracking-[0.18em] text-zinc-600 sm:inline font-mono">
              spend layer
            </span>
          </span>
        </button>

        <nav className="hidden items-center gap-5 text-xs text-zinc-500 sm:flex font-mono">
          <a href="#requests" className="hover:text-zinc-200 transition-colors">Spend requests</a>
          <a href="#receipts" className="hover:text-zinc-200 transition-colors">Receipts</a>
          <a href="#answer"   className="hover:text-zinc-200 transition-colors">Final answer</a>
        </nav>

        <Link
          to="/"
          className="text-xs font-semibold text-zinc-600 hover:text-zinc-200 transition-colors font-mono"
        >
          ← Home
        </Link>
      </div>
    </header>
  );
}
