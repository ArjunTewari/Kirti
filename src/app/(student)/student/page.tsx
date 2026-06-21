"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { CalendarDays, Users } from "lucide-react";
import { getHeadcount } from "@/lib/class-booking";

type ClassEvent = {
  id: string; title: string; date: string; capacity: number; cancelledAt: string | null;
  bookings: { status: string; studentId: string }[];
};

export default function StudentClassesPage() {
  const [classes, setClasses] = useState<ClassEvent[]>([]);
  const [myId, setMyId] = useState<string>("");
  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/me").then(r => r.json()).then(d => setMyId(d.id));
    load();
  }, []);

  const load = () => fetch("/api/classes").then(r => r.json()).then(setClasses);

  const isBooked = (c: ClassEvent) => c.bookings.some(b => b.studentId === myId && b.status === "BOOKED");
  const isFull = (c: ClassEvent) => getHeadcount(c.bookings) >= c.capacity;

  const book = async (id: string) => {
    setLoading(id);
    await fetch(`/api/classes/${id}/book`, { method: "POST" });
    await load();
    setLoading(null);
  };

  const cancel = async (id: string) => {
    setLoading(id);
    await fetch(`/api/classes/${id}/book`, { method: "DELETE" });
    await load();
    setLoading(null);
  };

  const upcoming = classes.filter(c => !c.cancelledAt && new Date(c.date) >= new Date());
  const past = classes.filter(c => !c.cancelledAt && new Date(c.date) < new Date());

  function ClassCard({ c }: { c: ClassEvent }) {
    const booked = isBooked(c);
    const full = isFull(c);
    const busy = loading === c.id;
    const headcount = getHeadcount(c.bookings);

    return (
      <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
            <CalendarDays size={18} className="text-emerald-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{c.title}</p>
            <p className="text-xs text-gray-400 mt-0.5">{format(new Date(c.date), "EEE, d MMM · h:mm a")}</p>
            <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
              <Users size={11} />{headcount}/{c.capacity} booked
            </div>
          </div>
        </div>
        {booked ? (
          <button onClick={() => cancel(c.id)} disabled={busy}
            className="text-xs border border-red-200 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-50 disabled:opacity-50 transition-colors shrink-0">
            {busy ? "…" : "Cancel Booking"}
          </button>
        ) : (
          <button onClick={() => book(c.id)} disabled={busy || full}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium disabled:opacity-50 transition-colors shrink-0 ${full ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-emerald-600 text-white hover:bg-emerald-700"}`}>
            {busy ? "…" : full ? "Full" : "Book Spot"}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">My Classes</h1>
      {upcoming.length > 0 && (
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Upcoming</p>
          <div className="space-y-3">{upcoming.map(c => <ClassCard key={c.id} c={c} />)}</div>
        </div>
      )}
      {past.length > 0 && (
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Past</p>
          <div className="space-y-3 opacity-60">{past.map(c => <ClassCard key={c.id} c={c} />)}</div>
        </div>
      )}
      {classes.length === 0 && <p className="text-sm text-gray-400">No classes available yet.</p>}
    </div>
  );
}
