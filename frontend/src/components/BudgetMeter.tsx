import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect } from "react";

interface BudgetMeterProps {
  startingBudgetUsd: number;
  totalSpentUsd: number;
  remainingBudgetUsd: number;
}

function AnimatedUsd({ value }: { value: number }) {
  const motionValue = useMotionValue(0);
  const display = useTransform(motionValue, (latest) => `$${latest.toFixed(value < 0.001 && value > 0 ? 4 : 3)}`);

  useEffect(() => {
    const controls = animate(motionValue, value, { duration: 0.6, ease: "easeOut" });
    return controls.stop;
  }, [motionValue, value]);

  return <motion.span>{display}</motion.span>;
}

export function BudgetMeter({ startingBudgetUsd, totalSpentUsd, remainingBudgetUsd }: BudgetMeterProps) {
  const used = startingBudgetUsd > 0 ? Math.min(100, (totalSpentUsd / startingBudgetUsd) * 100) : 0;
  const barColor = used < 50 ? "#16a34a" : used < 85 ? "#d97706" : "#dc2626";

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card"
    >
      <div className="border-b border-slate-100 px-4 py-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
          Set a limit
        </p>
      </div>
      <div className="p-4">
        <div className="mb-4 h-2 overflow-hidden rounded-full bg-slate-100">
          <motion.div
            className="h-full rounded-full"
            initial={{ width: 0, backgroundColor: barColor }}
            animate={{ width: `${used}%`, backgroundColor: barColor }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-amber-100 bg-amber-50 p-3">
            <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-700">Spent</span>
            <p className="mt-1 font-mono text-lg font-bold text-amber-800">
              <AnimatedUsd value={totalSpentUsd} />
            </p>
          </div>
          <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-3">
            <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-700">Remaining</span>
            <p className="mt-1 font-mono text-lg font-bold text-emerald-800">
              <AnimatedUsd value={remainingBudgetUsd} />
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
          <span>Starting budget</span>
          <span className="font-mono font-semibold text-slate-800">${startingBudgetUsd.toFixed(4).replace(/0$/, "")}</span>
        </div>
      </div>
    </motion.section>
  );
}
