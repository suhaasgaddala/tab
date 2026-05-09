import { motion } from "framer-motion";
import type { Receipt } from "../lib/types";

interface ReceiptLedgerProps {
  receipts: Receipt[];
}

export function ReceiptLedger({ receipts }: ReceiptLedgerProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card" id="receipts">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Receipt</p>
          <h2 className="mt-1 text-base font-bold text-slate-950">Ledger</h2>
        </div>
        <span className="rounded-full border border-slate-200 px-3 py-1 font-mono text-xs text-slate-600">
          {receipts.length} paid
        </span>
      </div>

      {receipts.length === 0 ? (
        <div className="p-5 text-sm text-slate-500">No completed receipts for this run.</div>
      ) : (
        <div className="divide-y divide-slate-100">
          {receipts.map((receipt, index) => (
            <motion.div
              key={receipt.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.08 }}
              className="p-5"
            >
              <div className="flex items-center justify-between gap-4">
                <span className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
                  {receipt.id}
                </span>
                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-700">
                  {receipt.status}
                </span>
              </div>
              <dl className="mt-4 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <dt className="text-slate-400">Tool</dt>
                  <dd className="mt-1 font-mono font-semibold text-slate-900">{receipt.tool}</dd>
                </div>
                <div>
                  <dt className="text-slate-400">Amount</dt>
                  <dd className="mt-1 font-mono font-semibold text-amber-700">${receipt.amountUsd.toFixed(3)}</dd>
                </div>
                <div>
                  <dt className="text-slate-400">Provider</dt>
                  <dd className="mt-1 text-slate-700">{receipt.provider}</dd>
                </div>
                <div>
                  <dt className="text-slate-400">Rail</dt>
                  <dd className="mt-1 text-slate-700">{receipt.rail} on {receipt.network}</dd>
                </div>
              </dl>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
