import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { CheckCircle2, XCircle } from "lucide-react";

export default async function StudentAttendancePage() {
  const session = await auth();
  const attendances = await prisma.attendance.findMany({
    where: { studentId: session!.user.id },
    include: { classEvent: { select: { title: true, date: true } } },
    orderBy: { classEvent: { date: "desc" } },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
        <p className="text-sm text-gray-500 mt-1">{attendances.length} classes attended</p>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {attendances.length === 0 ? (
          <p className="p-8 text-center text-sm text-gray-400">No attendance records yet.</p>
        ) : (
          <ul>
            {attendances.map(a => (
              <li key={a.id} className="flex items-center justify-between px-4 py-3 border-b border-gray-50 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-800">{a.classEvent.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{format(new Date(a.classEvent.date), "EEE, d MMM yyyy · h:mm a")}</p>
                </div>
                <span className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  <CheckCircle2 size={12} />Present
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
