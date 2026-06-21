"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { CheckCircle2, Clock, IndianRupee } from "lucide-react";

type Invoice = {
  id: string;
  type: string;
  month: string | null;
  amount: number;
  status: string;
  paidAt: string | null;
  paymentMethod: string | null;
  student: { name: string; phone: string | null };
};

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filter, setFilter] = useState<"ALL" | "PENDING" | "PAID">("ALL");
  const [generating, setGenerating] = useState(false);
  const [monthInput, setMonthInput] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });
  const [monthlyAmount, setMonthlyAmount] = useState("1500");

  const load = () => {
    const qs = filter !== "ALL" ? `?status=${filter}` : "";
    fetch(`/api/invoices${qs}`).then((r) => r.json()).then(setInvoices);
  };

  useEffect(() => { load(); }, [filter]);

  const markPaid = async (id: string) => {
    await fetch(`/api/invoices/${id}/pay`, { method: "POST" });
    load();
  };

  const generateMonthly = async () => {
    setGenerating(true);
    const res = await fetch("/api/invoices/generate-monthly", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ month: monthInput, amount: parseFloat(monthlyAmount) }),
    });
    const data = await res.json();
    setGenerating(false);
    alert(`Generated ${data.created} invoices for ${monthInput}`);
    load();
  };

  const pending = invoices.filter((i) => i.status === "PENDING");
  const paid = invoices.filter((i) => i.status === "PAID");
  const shown = filter === "ALL" ? invoices : filter === "PENDING" ? pending : paid;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
          <p className="text-sm text-gray-500 mt-1">
            {pending.length} pending · {paid.length} paid
          </p>
        </div>
      </div>

      {/* Generate monthly */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="font-semibold text-gray-900 text-sm mb-4">Generate Monthly Invoices</h2>
        <div className="flex items-end gap-3 flex-wrap">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Month</label>
            <input
              type="month"
              value={monthInput}
              onChange={(e) => setMonthInput(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Amount (₹)</label>
            <input
              type="number"
              value={monthlyAmount}
              onChange={(e) => setMonthlyAmount(e.target.value)}
              className="w-28 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <button
            onClick={generateMonthly}
            disabled={generating}
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-emerald-700 disabled:opacity-50 transition-colors"
          >
            {generating ? "Generating…" : "Generate for All Students"}
          </button>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {(["ALL", "PENDING", "PAID"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${filter === f ? "bg-emerald-600 text-white" : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-50"}`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {shown.length === 0 ? (
          <div className="p-10 text-center">
            <IndianRupee size={28} className="text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-400">No invoices found.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Student</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Month</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Action</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((inv) => (
                <tr key={inv.id} className="border-b border-gray-50 last:border-0">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-800">{inv.student.name}</p>
                    <p className="text-xs text-gray-400">{inv.student.phone}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${inv.type === "REGISTRATION" ? "bg-blue-50 text-blue-600" : "bg-purple-50 text-purple-600"}`}>
                      {inv.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{inv.month ?? "—"}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">₹{inv.amount.toLocaleString("en-IN")}</td>
                  <td className="px-4 py-3">
                    {inv.status === "PAID" ? (
                      <span className="flex items-center gap-1 text-xs text-emerald-600">
                        <CheckCircle2 size={13} /> Paid
                        {inv.paidAt && <span className="text-gray-400">· {format(new Date(inv.paidAt), "d MMM")}</span>}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-amber-600">
                        <Clock size={13} /> Pending
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {inv.status === "PENDING" && (
                      <button
                        onClick={() => markPaid(inv.id)}
                        className="text-xs bg-emerald-50 text-emerald-700 px-3 py-1 rounded-lg hover:bg-emerald-100 transition-colors"
                      >
                        Mark Paid (UPI)
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
