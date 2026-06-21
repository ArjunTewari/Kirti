"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  FileText,
  Megaphone,
  LogOut,
} from "lucide-react";

const NAV = [
  { href: "/dashboard",               label: "Overview",      icon: LayoutDashboard },
  { href: "/dashboard/classes",        label: "Classes",       icon: CalendarDays },
  { href: "/dashboard/students",       label: "Students",      icon: Users },
  { href: "/dashboard/invoices",       label: "Invoices",      icon: FileText },
  { href: "/dashboard/announcements",  label: "Announcements", icon: Megaphone },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 shrink-0 flex flex-col h-full"
      style={{ background: "white", borderRight: "1px solid var(--color-warm-border)" }}>

      {/* Logo */}
      <div className="px-5 py-5 flex items-center gap-3"
        style={{ borderBottom: "1px solid var(--color-warm-muted)" }}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: "var(--color-sage-50)" }}>
          <LotusIcon />
        </div>
        <div>
          <p className="font-semibold text-sm" style={{ fontFamily: "var(--font-lora)", color: "var(--color-forest)" }}>
            Kirti Yoga
          </p>
          <p className="text-[11px]" style={{ color: "var(--color-muted-sage)" }}>Teacher Portal</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link key={href} href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer"
              style={{
                background: active ? "var(--color-sage-50)" : "transparent",
                color: active ? "var(--color-sage-700)" : "var(--color-muted-sage)",
              }}>
              <Icon size={17} strokeWidth={active ? 2.2 : 1.8} />
              {label}
              {active && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full"
                  style={{ background: "var(--color-sage-500)" }} />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Sign out */}
      <div className="px-3 py-4" style={{ borderTop: "1px solid var(--color-warm-muted)" }}>
        <button onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer group"
          style={{ color: "var(--color-muted-sage)" }}>
          <LogOut size={17} strokeWidth={1.8} className="group-hover:text-red-400 transition-colors" />
          <span className="group-hover:text-red-400 transition-colors">Sign out</span>
        </button>
      </div>
    </aside>
  );
}

function LotusIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M12 21c0 0-8-5-8-11a8 8 0 0 1 8-4 8 8 0 0 1 8 4c0 6-8 11-8 11z"
        fill="var(--color-sage-200)" />
      <path d="M12 21c0 0-4-3-4-7 0-2.5 1.8-4.5 4-5 2.2.5 4 2.5 4 5 0 4-4 7-4 7z"
        fill="var(--color-sage-500)" />
      <circle cx="12" cy="14" r="2" fill="var(--color-terra-400)" />
    </svg>
  );
}
