"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckSquare, Square } from "lucide-react";

type Student = { id: string; name: string; phone: string | null };
type ClassInfo = {
  id: string;
  title: string;
  date: string;
  bookings: { student: Student }[];
  attendances: { studentId: string }[];
};

export default function AttendancePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [classInfo, setClassInfo] = useState<ClassInfo | null>(null);
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch(`/api/classes/${id}`)
      .then((r) => r.json())
      .then((data: ClassInfo) => {
        setClassInfo(data);
        setChecked(new Set(data.attendances.map((a) => a.studentId)));
      });
  }, [id]);

  const toggle = (sid: string) =>
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(sid) ? next.delete(sid) : next.add(sid);
      return next;
    });

  const save = async () => {
    setSaving(true);
    await fetch(`/api/classes/${id}/attendance`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentIds: [...checked] }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => { setSaved(false); router.push(`/dashboard/classes/${id}`); }, 1000);
  };

  if (!classInfo) return <div className="p-6 text-gray-400 text-sm">Loading…</div>;

  return (
    <div className="max-w-lg space-y-5">
      <div className="flex items-center gap-3">
        <Link href={`/dashboard/classes/${id}`} className="text-gray-400 hover:text-gray-600">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Mark Attendance</h1>
          <p className="text-sm text-gray-500">{classInfo.title}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Students</span>
          <span className="text-xs text-gray-400">{checked.size} / {classInfo.bookings.length} marked</span>
        </div>
        {classInfo.bookings.length === 0 ? (
          <p className="p-6 text-sm text-gray-400 text-center">No students booked for this class.</p>
        ) : (
          <ul>
            {classInfo.bookings.map(({ student }) => {
              const present = checked.has(student.id);
              return (
                <li
                  key={student.id}
                  onClick={() => toggle(student.id)}
                  className={`flex items-center gap-4 px-4 py-3 border-b border-gray-50 last:border-0 cursor-pointer transition-colors ${present ? "bg-emerald-50" : "hover:bg-gray-50"}`}
                >
                  {present
                    ? <CheckSquare size={20} className="text-emerald-600 shrink-0" />
                    : <Square size={20} className="text-gray-300 shrink-0" />}
                  <div>
                    <p className="text-sm font-medium text-gray-800">{student.name}</p>
                    {student.phone && <p className="text-xs text-gray-400">{student.phone}</p>}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <button
        onClick={save}
        disabled={saving || saved}
        className="w-full bg-emerald-600 text-white py-2.5 rounded-lg font-medium text-sm hover:bg-emerald-700 disabled:opacity-50 transition-colors"
      >
        {saved ? "Saved ✓" : saving ? "Saving…" : "Save Attendance"}
      </button>
    </div>
  );
}
