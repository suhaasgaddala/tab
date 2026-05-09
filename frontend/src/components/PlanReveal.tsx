import { motion } from "framer-motion";

interface PlanRevealProps {
  plan: string[];
}

export function PlanReveal({ plan }: PlanRevealProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900" id="plan">
      <div className="border-b border-zinc-800 px-5 py-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-400">Agent Plan</p>
        <p className="mt-0.5 text-sm font-bold text-zinc-100">Reasoning before first tool call</p>
      </div>

      <div className="relative p-5">
        {/* Vertical timeline line */}
        <div className="absolute bottom-5 left-[33px] top-5 w-px bg-zinc-800" />

        <ol className="space-y-5">
          {plan.map((step, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="relative flex items-start gap-4"
            >
              {/* Step circle — sits on the timeline line */}
              <span className="relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-amber-500/25 bg-zinc-950 font-mono text-[10px] font-bold text-amber-400">
                {i + 1}
              </span>

              <div className="flex-1 pt-0.5">
                <p className="text-sm leading-relaxed text-zinc-400">{step}</p>
              </div>

              {/* Completion dot */}
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.1 + 0.3 }}
                className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500"
              />
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
