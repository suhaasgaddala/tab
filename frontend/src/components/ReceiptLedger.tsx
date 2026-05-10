import { motion } from "framer-motion";
import type { Receipt } from "../lib/types";

interface ReceiptLedgerProps {
  receipts: Receipt[];
}

export function ReceiptLedger({ receipts }: ReceiptLedgerProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-800 shadow-card" id="receipts">
      <div className="flex items-center justify-between border-b border-slate-700 px-5 py-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Receipt</p>
          <h2 className="mt-0.5 text-sm font-bold text-slate-100">Ledger</h2>
        </div>
        <span className="rounded-full border border-slate-600 px-3 py-0.5 font-mono text-[10px] text-slate-500">
          {receipts.length} paid
        </span>
      </div>

      {receipts.length === 0 ? (
        <div className="p-5 text-xs text-slate-600 font-mono">No completed receipts for this run.</div>
      ) : (
        <div className="divide-y divide-slate-700">
          {receipts.map((receipt, index) => (
            <motion.div
              key={receipt.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.08 }}
              className="p-5"
            >
              <div className="flex items-center justify-between gap-4 mb-3">
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-slate-600">
                  {receipt.id}
                </span>
                <span className="rounded-full border border-green-500/20 bg-green-500/8 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-green-400">
                  ✓ {receipt.status}
                </span>
              </div>
              <dl className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <dt className="text-slate-600">Tool</dt>
                  <dd className="mt-0.5 font-mono font-semibold text-slate-200">{receipt.tool}</dd>
                </div>
                <div>
                  <dt className="text-slate-600">Amount</dt>
                  <dd className="mt-0.5 font-mono font-bold text-amber-400">${receipt.amountUsd.toFixed(3)}</dd>
                </div>
                <div>
                  <dt className="text-slate-600">Provider</dt>
                  <dd className="mt-0.5 text-slate-300">{receipt.provider}</dd>
                </div>
                <div>
                  <dt className="text-slate-600">Rail</dt>
                  <dd className="mt-0.5 font-mono text-slate-400">{receipt.rail} · {receipt.network}</dd>
                </div>
              </dl>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
