"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewAnnouncementPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!title.trim() || !body.trim()) return;
    setSaving(true);
    await fetch("/api/announcements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, body }),
    });
    router.push("/dashboard/announcements");
    router.refresh();
  };

  return (
    <div className="max-w-xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard/announcements" className="text-gray-400 hover:text-gray-600"><ArrowLeft size={20} /></Link>
        <h1 className="text-2xl font-bold text-gray-900">New Announcement</h1>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. No class on Sunday"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
          <textarea value={body} onChange={e => setBody(e.target.value)} rows={4} placeholder="Write your message here…"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none" />
        </div>
        <div className="flex gap-3">
          <button onClick={save} disabled={saving || !title.trim() || !body.trim()}
            className="flex-1 bg-emerald-600 text-white py-2.5 rounded-lg font-medium text-sm hover:bg-emerald-700 disabled:opacity-50 transition-colors">
            {saving ? "Posting…" : "Post Announcement"}
          </button>
          <Link href="/dashboard/announcements"
            className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
}
