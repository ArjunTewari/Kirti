import { prisma } from "@/lib/prisma";
import { getHeadcount } from "@/lib/class-booking";
import { format } from "date-fns";
import Link from "next/link";
import { CalendarDays, Users, PlusCircle, XCircle } from "lucide-react";

export default async function ClassesPage() {
  const classes = await prisma.classEvent.findMany({
    orderBy: { date: "asc" },
    include: {
      bookings: { where: { status: "BOOKED" }, select: { status: true } },
    },
  });

  const upcoming = classes.filter((c) => !c.cancelledAt && c.date >= new Date());
  const past = classes.filter((c) => !c.cancelledAt && c.date < new Date());
  const cancelled = classes.filter((c) => c.cancelledAt);

  function ClassRow({ c }: { c: (typeof classes)[number] }) {
    const booked = getHeadcount(c.bookings);
    const isFull = booked >= c.capacity;
    return (
      <Link
        href={`/dashboard/classes/${c.id}`}
        className="flex items-center justify-between p-4 hover:bg-gray-50 border-b border-gray-100 last:border-0 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
            <CalendarDays size={18} className="text-emerald-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{c.title}</p>
            <p className="text-xs text-gray-400 mt-0.5">
              {format(new Date(c.date), "EEE, d MMM yyyy · h:mm a")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Users size={12} />
              <span className={isFull ? "text-red-500 font-medium" : ""}>
                {booked}/{c.capacity}
              </span>
            </div>
            {isFull && (
              <span className="text-xs text-red-500">Full</span>
            )}
          </div>
          <span className="text-xs text-gray-300">›</span>
        </div>
      </Link>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Classes</h1>
          <p className="text-sm text-gray-500 mt-1">
            {upcoming.length} upcoming · {past.length} past
          </p>
        </div>
        <Link
          href="/dashboard/classes/new"
          className="flex items-center gap-2 bg-emerald-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <PlusCircle size={16} />
          New Class
        </Link>
      </div>

      {upcoming.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Upcoming</p>
          </div>
          {upcoming.map((c) => (
            <ClassRow key={c.id} c={c} />
          ))}
        </div>
      )}

      {past.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Past</p>
          </div>
          {past.map((c) => (
            <ClassRow key={c.id} c={c} />
          ))}
        </div>
      )}

      {cancelled.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden opacity-60">
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
            <XCircle size={14} className="text-gray-400" />
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Cancelled</p>
          </div>
          {cancelled.map((c) => (
            <ClassRow key={c.id} c={c} />
          ))}
        </div>
      )}

      {classes.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <CalendarDays size={32} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">No classes yet.</p>
          <Link
            href="/dashboard/classes/new"
            className="inline-block mt-3 text-emerald-600 text-sm hover:underline"
          >
            Create your first class →
          </Link>
        </div>
      )}
    </div>
  );
}
