interface TopNavProps {
  onNewRun: () => void;
}

export function TopNav({ onNewRun }: TopNavProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        <button onClick={onNewRun} className="flex items-center gap-3" type="button">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 font-mono text-sm font-bold text-white shadow-card">
            T
          </span>
          <span className="flex flex-col text-left">
            <span className="text-sm font-bold tracking-tight text-slate-950">Tab</span>
            <span className="hidden text-[10px] uppercase tracking-[0.18em] text-slate-400 sm:inline">
              spend layer
            </span>
          </span>
        </button>

        <nav className="hidden items-center gap-5 text-sm text-slate-500 sm:flex">
          <a href="#requests" className="hover:text-slate-950">
            Spend request
          </a>
          <a href="#receipts" className="hover:text-slate-950">
            Receipt
          </a>
          <a href="#answer" className="hover:text-slate-950">
            Close the Tab
          </a>
        </nav>
      </div>
    </header>
  );
}
