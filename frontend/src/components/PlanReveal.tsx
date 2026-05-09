import { motion } from "framer-motion";

interface PlanRevealProps {
  plan: string[];
}

export function PlanReveal({ plan }: PlanRevealProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card" id="plan">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-indigo-600">
        Plan
      </p>
      <ol className="mt-4 space-y-3">
        {plan.map((step, index) => (
          <motion.li
            key={step}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.06 }}
            className="flex items-start gap-3"
          >
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-indigo-200 bg-indigo-50 font-mono text-[11px] font-bold text-indigo-700">
              {index + 1}
            </span>
            <span className="text-sm leading-relaxed text-slate-700">{step}</span>
          </motion.li>
        ))}
      </ol>
    </section>
  );
}
