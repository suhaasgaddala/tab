import { motion } from "framer-motion";

interface PlanRevealProps {
  plan: string[];
}

export function PlanReveal({ plan }: PlanRevealProps) {
  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 shadow-card" id="plan">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-400 mb-4">
        Plan
      </p>
      <ol className="space-y-3">
        {plan.map((step, index) => (
          <motion.li
            key={step}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.07 }}
            className="flex items-start gap-3"
          >
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-amber-500/20 bg-amber-500/8 font-mono text-[10px] font-bold text-amber-400">
              {index + 1}
            </span>
            <span className="text-sm leading-relaxed text-zinc-400">{step}</span>
          </motion.li>
        ))}
      </ol>
    </section>
  );
}
