import { prisma } from "@/lib/prisma";
import { getHeadcount } from "@/lib/class-booking";
import { format } from "date-fns";
import Link from "next/link";
import { ArrowLeft, Users, CheckCircle2, XCircle } from "lucide-react";
import { notFound } from "next/navigation";
import { CancelClassButton } from "./CancelClassButton";

export default async function ClassDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const event = await prisma.classEvent.findUnique({
    where: { id },
    include: {
      bookings: {
        where: { status: { in: ["BOOKED", "ATTENDED"] } },
        include: { student: { select: { id: true, name: true, phone: true } } },
      },
      attendances: { select: { studentId: true } },
    },
  });

  if (!event) notFound();

  const bookedCount = getHeadcount(event.bookings);
  const attendedIds = new Set(event.attendances.map((a) => a.studentId));

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/classes" className="text-gray-400 hover:text-gray-600">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{event.title}</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {format(new Date(event.date), "EEEE, d MMMM yyyy · h:mm a")}
          </p>
        </div>
      </div>

      {event.cancelledAt && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg flex items-center gap-2">
          <XCircle size={16} />
          This class was cancelled on {format(new Date(event.cancelledAt), "d MMM yyyy")}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{bookedCount}</p>
          <p className="text-xs text-gray-500 mt-0.5">Booked</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{event.capacity}</p>
          <p className="text-xs text-gray-500 mt-0.5">Capacity</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{event.capacity - bookedCount}</p>
          <p className="text-xs text-gray-500 mt-0.5">Seats Left</p>
        </div>
      </div>

      {/* Booked students */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users size={16} className="text-gray-400" />
            <h2 className="font-semibold text-gray-900 text-sm">Booked Students</h2>
          </div>
          <Link
            href={`/dashboard/classes/${id}/attendance`}
            className="text-xs text-emerald-600 hover:underline"
          >
            Mark Attendance →
          </Link>
        </div>

        {event.bookings.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-400">No students booked yet.</div>
        ) : (
          <ul>
            {event.bookings.map((b) => (
              <li
                key={b.id}
                className="flex items-center justify-between px-5 py-3 border-b border-gray-50 last:border-0"
              >
                <div>
                  <p className="text-sm font-medium text-gray-800">{b.student.name}</p>
                  <p className="text-xs text-gray-400">{b.student.phone}</p>
                </div>
                {attendedIds.has(b.studentId) ? (
                  <span className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    <CheckCircle2 size={12} /> Attended
                  </span>
                ) : (
                  <span className="text-xs text-gray-400">Booked</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {!event.cancelledAt && (
        <div className="flex gap-3">
          <Link
            href={`/dashboard/classes/${id}/edit`}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Edit Class
          </Link>
          <CancelClassButton classId={id} />
        </div>
      )}
    </div>
  );
}
