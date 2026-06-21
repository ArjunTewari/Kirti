"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, PlusCircle, AlertCircle } from "lucide-react";

type Student = { id: string; name: string; email: string; phone: string | null; invoices: { id: string; amount: number }[] };

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    fetch("/api/students").then(r => r.json()).then(setStudents);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Students</h1>
          <p className="text-sm text-gray-500 mt-1">{students.length} enrolled</p>
        </div>
        <Link href="/dashboard/students/new"
          className="flex items-center gap-2 bg-emerald-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
          <PlusCircle size={16} />Add Student
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {students.length === 0 ? (
          <div className="p-10 text-center">
            <Users size={28} className="text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-400">No students yet.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Email</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Phone</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Dues</th>
              </tr>
            </thead>
            <tbody>
              {students.map(s => {
                const due = s.invoices.reduce((sum, i) => sum + i.amount, 0);
                return (
                  <tr key={s.id} className="border-b border-gray-50 last:border-0">
                    <td className="px-4 py-3 font-medium text-gray-800">{s.name}</td>
                    <td className="px-4 py-3 text-gray-500">{s.email}</td>
                    <td className="px-4 py-3 text-gray-500">{s.phone ?? "—"}</td>
                    <td className="px-4 py-3">
                      {due > 0 ? (
                        <span className="flex items-center gap-1 text-xs text-amber-600 font-medium">
                          <AlertCircle size={13} />₹{due.toLocaleString("en-IN")}
                        </span>
                      ) : (
                        <span className="text-xs text-emerald-600">Clear</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
