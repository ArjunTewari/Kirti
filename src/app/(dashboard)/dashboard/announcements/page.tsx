"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Trash2, PlusCircle } from "lucide-react";
import Link from "next/link";

type Ann = { id: string; title: string; body: string; createdAt: string };

export default function AnnouncementsPage() {
  const [anns, setAnns] = useState<Ann[]>([]);

  const load = () => fetch("/api/announcements").then(r => r.json()).then(setAnns);
  useEffect(() => { load(); }, []);

  const del = async (id: string) => {
    if (!confirm("Delete this announcement?")) return;
    await fetch(`/api/announcements/${id}`, { method: "DELETE" });
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Announcements</h1>
        <Link href="/dashboard/announcements/new"
          className="flex items-center gap-2 bg-emerald-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
          <PlusCircle size={16} />New Post
        </Link>
      </div>

      {anns.length === 0
        ? <p className="text-sm text-gray-400">No announcements yet.</p>
        : <div className="space-y-3">
            {anns.map(a => (
              <div key={a.id} className="bg-white border border-gray-200 rounded-xl p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{a.title}</p>
                    <p className="text-gray-600 text-sm mt-1">{a.body}</p>
                    <p className="text-xs text-gray-400 mt-2">{format(new Date(a.createdAt), "d MMM yyyy · h:mm a")}</p>
                  </div>
                  <button onClick={() => del(a.id)} className="text-gray-400 hover:text-red-500 transition-colors shrink-0">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>}
    </div>
  );
}
