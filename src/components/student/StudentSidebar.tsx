"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { CalendarDays, FileText, CheckSquare, Megaphone, LogOut } from "lucide-react";

const NAV = [
  { href: "/student", label: "My Classes", icon: CalendarDays },
  { href: "/student/invoices", label: "Invoices", icon: FileText },
  { href: "/student/attendance", label: "Attendance", icon: CheckSquare },
  { href: "/student/announcements", label: "Announcements", icon: Megaphone },
];

export function StudentSidebar({ name }: { name: string }) {
  const pathname = usePathname();
  return (
    <aside className="w-64 shrink-0 bg-white border-r border-gray-200 flex flex-col h-full">
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🧘</span>
          <div>
            <p className="font-bold text-gray-900 text-sm">Kirti Yoga</p>
            <p className="text-xs text-gray-500 truncate max-w-[130px]">{name}</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${active ? "bg-emerald-50 text-emerald-700" : "text-gray-600 hover:bg-gray-50"}`}>
              <Icon size={18} />{label}
            </Link>
          );
        })}
      </nav>
      <div className="px-3 py-4 border-t border-gray-100">
        <button onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors">
          <LogOut size={18} />Sign out
        </button>
      </div>
    </aside>
  );
}
