import { motion } from "framer-motion";
import type { Receipt } from "../lib/types";

interface ReceiptLedgerProps {
  receipts: Receipt[];
}

export function ReceiptLedger({ receipts }: ReceiptLedgerProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-card" id="receipts">
      <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600">Receipt</p>
          <h2 className="mt-0.5 text-sm font-bold text-zinc-100">Ledger</h2>
        </div>
        <span className="rounded-full border border-zinc-700 px-3 py-0.5 font-mono text-[10px] text-zinc-500">
          {receipts.length} paid
        </span>
      </div>

      {receipts.length === 0 ? (
        <div className="p-5 text-xs text-zinc-600 font-mono">No completed receipts for this run.</div>
      ) : (
        <div className="divide-y divide-zinc-800">
          {receipts.map((receipt, index) => (
            <motion.div
              key={receipt.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.08 }}
              className="p-5"
            >
              <div className="flex items-center justify-between gap-4 mb-3">
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-zinc-600">
                  {receipt.id}
                </span>
                <span className="rounded-full border border-emerald-500/20 bg-emerald-500/8 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                  ✓ {receipt.status}
                </span>
              </div>
              <dl className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <dt className="text-zinc-600">Tool</dt>
                  <dd className="mt-0.5 font-mono font-semibold text-zinc-200">{receipt.tool}</dd>
                </div>
                <div>
                  <dt className="text-zinc-600">Amount</dt>
                  <dd className="mt-0.5 font-mono font-bold text-amber-400">${receipt.amountUsd.toFixed(3)}</dd>
                </div>
                <div>
                  <dt className="text-zinc-600">Provider</dt>
                  <dd className="mt-0.5 text-zinc-300">{receipt.provider}</dd>
                </div>
                <div>
                  <dt className="text-zinc-600">Rail</dt>
                  <dd className="mt-0.5 font-mono text-zinc-400">{receipt.rail} · {receipt.network}</dd>
                </div>
              </dl>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
