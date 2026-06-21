import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { Megaphone } from "lucide-react";

export default async function StudentAnnouncementsPage() {
  const announcements = await prisma.announcement.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Announcements</h1>
      {announcements.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-10 text-center">
          <Megaphone size={28} className="text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-400">No announcements yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {announcements.map(a => (
            <div key={a.id} className="bg-white border border-gray-200 rounded-xl p-4 border-l-4 border-l-emerald-400">
              <p className="font-semibold text-gray-900 text-sm">{a.title}</p>
              <p className="text-gray-600 text-sm mt-1">{a.body}</p>
              <p className="text-xs text-gray-400 mt-2">{format(new Date(a.createdAt), "d MMM yyyy")}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
