"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CalendarDays, Users, FileText, Megaphone } from "lucide-react";

const NAV = [
  { href: "/dashboard",              label: "Home",          icon: LayoutDashboard },
  { href: "/dashboard/classes",       label: "Classes",       icon: CalendarDays },
  { href: "/dashboard/students",      label: "Students",      icon: Users },
  { href: "/dashboard/invoices",      label: "Invoices",      icon: FileText },
  { href: "/dashboard/announcements", label: "Updates",       icon: Megaphone },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden safe-area-bottom"
      style={{ background: "white", borderTop: "1px solid var(--color-warm-border)", boxShadow: "0 -4px 20px rgba(44,62,48,0.08)" }}>
      <div className="flex items-center justify-around px-2 py-2">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link key={href} href={href}
              className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200 min-w-[56px]"
              style={{
                color: active ? "var(--color-sage-600)" : "var(--color-muted-sage)",
                background: active ? "var(--color-sage-50)" : "transparent",
              }}>
              <Icon size={20} strokeWidth={active ? 2.2 : 1.7} />
              <span className="text-[10px] font-semibold tracking-wide">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
