"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { CheckCircle2, Clock, IndianRupee } from "lucide-react";

type Invoice = { id: string; type: string; month: string | null; amount: number; status: string; paidAt: string | null; };

export default function StudentInvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    fetch("/api/invoices").then(r => r.json()).then(setInvoices);
  }, []);

  const pending = invoices.filter(i => i.status === "PENDING");
  const total = pending.reduce((s, i) => s + i.amount, 0);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>

      {pending.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-amber-800">{pending.length} pending invoice{pending.length > 1 ? "s" : ""}</p>
            <p className="text-xs text-amber-600 mt-0.5">Please pay via UPI to Kirti. Total due: ₹{total.toLocaleString("en-IN")}</p>
          </div>
          <IndianRupee size={24} className="text-amber-400" />
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {invoices.length === 0 ? (
          <p className="p-8 text-center text-sm text-gray-400">No invoices yet.</p>
        ) : (
          <ul>
            {invoices.map(inv => (
              <li key={inv.id} className="flex items-center justify-between px-4 py-3.5 border-b border-gray-50 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {inv.type === "REGISTRATION" ? "Registration Fee" : `Monthly Fee — ${inv.month}`}
                  </p>
                  {inv.paidAt && <p className="text-xs text-gray-400 mt-0.5">Paid {format(new Date(inv.paidAt), "d MMM yyyy")}</p>}
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">₹{inv.amount.toLocaleString("en-IN")}</p>
                  {inv.status === "PAID"
                    ? <span className="text-xs text-emerald-600 flex items-center gap-1 justify-end mt-0.5"><CheckCircle2 size={11} />Paid</span>
                    : <span className="text-xs text-amber-600 flex items-center gap-1 justify-end mt-0.5"><Clock size={11} />Pending</span>}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
