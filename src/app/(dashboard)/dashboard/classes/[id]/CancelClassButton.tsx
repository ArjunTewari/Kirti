"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { XCircle } from "lucide-react";

export function CancelClassButton({ classId }: { classId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleCancel = async () => {
    if (!confirm("Cancel this class? All booked students will be notified.")) return;
    setLoading(true);

    await fetch(`/api/classes/${classId}`, { method: "DELETE" });
    router.refresh();
    setLoading(false);
  };

  return (
    <button
      onClick={handleCancel}
      disabled={loading}
      className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-600 rounded-lg text-sm hover:bg-red-50 disabled:opacity-50 transition-colors"
    >
      <XCircle size={16} />
      {loading ? "Cancelling…" : "Cancel Class"}
    </button>
  );
}
