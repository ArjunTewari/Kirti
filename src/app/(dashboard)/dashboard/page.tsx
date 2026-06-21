import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { computeDashboardStats } from "@/lib/dashboard-stats";
import { Users, FileText, IndianRupee, AlertCircle, Plus, UserPlus, Megaphone, ArrowRight } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default async function DashboardPage() {
  const session = await auth();
  const firstName = session?.user.name?.split(" ")[0] ?? "Teacher";

  const [studentCount, invoices, upcomingClasses, recentAnnouncements] = await Promise.all([
    prisma.user.count({ where: { role: "STUDENT" } }),
    prisma.invoice.findMany({ select: { status: true, amount: true, paidAt: true } }),
    prisma.classEvent.findMany({
      where: { date: { gte: new Date() }, cancelledAt: null },
      orderBy: { date: "asc" },
      take: 5,
      include: { bookings: { where: { status: "BOOKED" } } },
    }),
    prisma.announcement.findMany({ orderBy: { createdAt: "desc" }, take: 4 }),
  ]);

  const stats = computeDashboardStats(studentCount, invoices);

  const statCards = [
    { label: "Total Students", value: stats.totalStudents, icon: Users,        color: "sage",  sub: "Active members" },
    { label: "Pending Dues",   value: stats.pendingInvoicesCount, icon: AlertCircle, color: "terra", sub: `₹${stats.pendingAmount.toLocaleString("en-IN")} outstanding` },
    { label: "Month Revenue",  value: `₹${stats.thisMonthRevenue.toLocaleString("en-IN")}`, icon: IndianRupee, color: "gold", sub: "Collected this month" },
    { label: "Total Invoices", value: invoices.length, icon: FileText, color: "rose", sub: `${invoices.filter(i => i.status === "PAID").length} paid` },
  ] as const;

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Hero greeting */}
      <div className="relative rounded-2xl overflow-hidden"
        style={{ background: "linear-gradient(135deg, var(--color-sage-50) 0%, #fff 60%, var(--color-terra-50) 100%)", border: "1px solid var(--color-warm-border)" }}>
        <div className="p-6 sm:p-8 relative z-10">
          <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: "var(--color-terra-500)" }}>Namaste</p>
          <h1 className="text-2xl sm:text-3xl font-bold" style={{ fontFamily: "var(--font-lora)", color: "var(--color-forest)" }}>
            Welcome back, {firstName}
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--color-muted-sage)" }}>
            {format(new Date(), "EEEE, d MMMM yyyy")}
          </p>
          <p className="mt-3 text-sm italic" style={{ color: "var(--color-sage-600)" }}>
            &ldquo;Yoga is the journey of the self, through the self, to the self.&rdquo;
          </p>
          <div className="flex flex-wrap gap-2 mt-5">
            <Link href="/dashboard/classes/new"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
              style={{ background: "var(--color-sage-600)" }}>
              <Plus size={15} /> New Class
            </Link>
            <Link href="/dashboard/students/new"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
              style={{ background: "white", color: "var(--color-forest)", border: "1px solid var(--color-warm-border)" }}>
              <UserPlus size={15} /> Add Student
            </Link>
            <Link href="/dashboard/announcements/new"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
              style={{ background: "white", color: "var(--color-forest)", border: "1px solid var(--color-warm-border)" }}>
              <Megaphone size={15} /> Post Update
            </Link>
          </div>
        </div>

        {/* 3D Yoga SVG Art */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 w-32 h-32 sm:w-44 sm:h-44 opacity-80 pointer-events-none">
          <YogaMeditationSVG />
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {statCards.map((card, i) => (
          <StatCard key={card.label} {...card} delay={`delay-${i === 0 ? 75 : i === 1 ? 150 : i === 2 ? 300 : 400}`} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">

        {/* Upcoming Classes */}
        <div className="yoga-card p-5 animate-fade-in-up delay-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-base" style={{ fontFamily: "var(--font-lora)", color: "var(--color-forest)" }}>
              Upcoming Classes
            </h2>
            <Link href="/dashboard/classes"
              className="flex items-center gap-1 text-xs font-semibold transition-colors hover:opacity-70"
              style={{ color: "var(--color-sage-600)" }}>
              View all <ArrowRight size={13} />
            </Link>
          </div>

          {upcomingClasses.length === 0 ? (
            <EmptyState text="No upcoming classes scheduled" />
          ) : (
            <ul className="space-y-2.5">
              {upcomingClasses.map((c, i) => {
                const booked = c.bookings.length;
                const pct = Math.round((booked / c.capacity) * 100);
                const full = booked >= c.capacity;
                return (
                  <li key={c.id}
                    className="flex items-start justify-between gap-3 p-3 rounded-xl transition-all duration-200 hover:-translate-y-0.5 animate-fade-in-up"
                    style={{ background: "var(--color-cream)", animationDelay: `${i * 60}ms` }}>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate" style={{ color: "var(--color-forest)" }}>{c.title}</p>
                      <p className="text-xs mt-0.5" style={{ color: "var(--color-muted-sage)" }}>
                        {format(new Date(c.date), "EEE, d MMM · h:mm a")}
                      </p>
                      {/* Capacity bar */}
                      <div className="mt-1.5 flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--color-warm-border)" }}>
                          <div className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${pct}%`, background: full ? "var(--color-terra-500)" : "var(--color-sage-400)" }} />
                        </div>
                        <span className="text-[10px] font-medium shrink-0" style={{ color: full ? "var(--color-terra-500)" : "var(--color-muted-sage)" }}>
                          {booked}/{c.capacity}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 mt-0.5"
                      style={{
                        background: full ? "var(--color-terra-50)" : "var(--color-sage-50)",
                        color: full ? "var(--color-terra-600)" : "var(--color-sage-700)",
                      }}>
                      {full ? "Full" : `${c.capacity - booked} left`}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Announcements */}
        <div className="yoga-card p-5 animate-fade-in-up delay-300">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-base" style={{ fontFamily: "var(--font-lora)", color: "var(--color-forest)" }}>
              Announcements
            </h2>
            <Link href="/dashboard/announcements"
              className="flex items-center gap-1 text-xs font-semibold transition-colors hover:opacity-70"
              style={{ color: "var(--color-sage-600)" }}>
              Manage <ArrowRight size={13} />
            </Link>
          </div>

          {recentAnnouncements.length === 0 ? (
            <EmptyState text="No announcements yet" />
          ) : (
            <ul className="space-y-2.5">
              {recentAnnouncements.map((a, i) => (
                <li key={a.id}
                  className="p-3 rounded-xl border-l-[3px] animate-fade-in-up"
                  style={{
                    background: "var(--color-cream)",
                    borderLeftColor: i % 2 === 0 ? "var(--color-sage-400)" : "var(--color-terra-400)",
                    animationDelay: `${i * 70}ms`,
                  }}>
                  <p className="text-sm font-semibold" style={{ color: "var(--color-forest)" }}>{a.title}</p>
                  <p className="text-xs mt-0.5 line-clamp-2" style={{ color: "var(--color-muted-sage)" }}>{a.body}</p>
                  <p className="text-[10px] mt-1.5 font-medium" style={{ color: "var(--color-warm-border)" }}>
                    {format(new Date(a.createdAt), "d MMM yyyy")}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Sub-components ─────────────────────────────── */

type StatColor = "sage" | "terra" | "gold" | "rose";

const COLOR = {
  sage:  { bg: "var(--color-sage-50)",  icon: "var(--color-sage-600)",  dot: "var(--color-sage-500)" },
  terra: { bg: "var(--color-terra-50)", icon: "var(--color-terra-500)", dot: "var(--color-terra-400)" },
  gold:  { bg: "#FEF9EC",               icon: "#D97706",                 dot: "#F59E0B" },
  rose:  { bg: "#FFF1F2",               icon: "#E11D48",                 dot: "#FB7185" },
};

import type { LucideIcon } from "lucide-react";

function StatCard({ label, value, icon: Icon, color, sub, delay }: {
  label: string; value: string | number; icon: LucideIcon;
  color: StatColor; sub?: string; delay?: string;
}) {
  const c = COLOR[color];
  return (
    <div className={`yoga-card p-4 sm:p-5 flex items-start gap-3 sm:gap-4 animate-fade-in-up ${delay ?? ""}`}>
      <div className="p-2.5 sm:p-3 rounded-xl shrink-0" style={{ background: c.bg }}>
        <Icon size={18} style={{ color: c.icon }} />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-muted-sage)" }}>{label}</p>
        <p className="text-xl sm:text-2xl font-bold mt-0.5 leading-none" style={{ fontFamily: "var(--font-lora)", color: "var(--color-forest)" }}>{value}</p>
        {sub && <p className="text-[11px] sm:text-xs mt-1" style={{ color: "var(--color-muted-sage)" }}>{sub}</p>}
      </div>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="py-8 text-center">
      <NatureLeafSVG />
      <p className="text-sm mt-2" style={{ color: "var(--color-muted-sage)" }}>{text}</p>
    </div>
  );
}

function NatureLeafSVG() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" className="mx-auto opacity-30" fill="none">
      <path d="M18 4C18 4 6 10 6 20c0 6.6 5.4 12 12 12s12-5.4 12-12C30 10 18 4 18 4z"
        fill="var(--color-sage-400)" />
      <path d="M18 8v20M12 14l6-6 6 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function YogaMeditationSVG() {
  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full animate-float-slow">
      <defs>
        <radialGradient id="bgGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#D4E8D9" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#EAF1EC" stopOpacity="0.2" />
        </radialGradient>
        <radialGradient id="bodyGrad" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#6EAB83" />
          <stop offset="100%" stopColor="#2F5C3D" />
        </radialGradient>
        <radialGradient id="headGrad" cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#D49A70" />
          <stop offset="100%" stopColor="#B3743F" />
        </radialGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* Background halo */}
      <circle cx="100" cy="100" r="88" fill="url(#bgGlow)" />
      <circle cx="100" cy="100" r="70" fill="white" fillOpacity="0.3" />

      {/* Lotus base petals */}
      <ellipse cx="100" cy="158" rx="52" ry="14" fill="#A9D4B5" fillOpacity="0.5" />
      <ellipse cx="72"  cy="155" rx="22" ry="9"  fill="#A9D4B5" fillOpacity="0.6" transform="rotate(-18 72 155)" />
      <ellipse cx="128" cy="155" rx="22" ry="9"  fill="#A9D4B5" fillOpacity="0.6" transform="rotate(18 128 155)" />
      <ellipse cx="100" cy="152" rx="38" ry="11" fill="#6EAB83" fillOpacity="0.4" />

      {/* Sitting body */}
      <path d="M68 148 Q70 130 100 128 Q130 130 132 148 Q116 155 100 156 Q84 155 68 148Z"
        fill="url(#bodyGrad)" />

      {/* Left arm/leg */}
      <path d="M72 145 Q60 148 58 156 Q70 158 84 154" fill="#4A7C59" />
      {/* Right arm/leg */}
      <path d="M128 145 Q140 148 142 156 Q130 158 116 154" fill="#4A7C59" />

      {/* Hands resting (mudra) */}
      <ellipse cx="66" cy="154" rx="7" ry="4" fill="#C4885A" opacity="0.85" transform="rotate(-10 66 154)" />
      <ellipse cx="134" cy="154" rx="7" ry="4" fill="#C4885A" opacity="0.85" transform="rotate(10 134 154)" />

      {/* Neck */}
      <rect x="94" y="114" width="12" height="16" rx="6" fill="#C4885A" />

      {/* Head */}
      <circle cx="100" cy="100" r="24" fill="url(#headGrad)" />

      {/* Hair */}
      <path d="M78 94 Q80 72 100 70 Q120 72 122 94"
        fill="#4A2E0A" />
      {/* Bun on top */}
      <ellipse cx="100" cy="71" rx="10" ry="8" fill="#3D2508" />

      {/* Closed eyes (peaceful) */}
      <path d="M88 100 Q92 97 96 100" stroke="#3D2508" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M104 100 Q108 97 112 100" stroke="#3D2508" strokeWidth="1.5" strokeLinecap="round" fill="none" />

      {/* Gentle smile */}
      <path d="M93 109 Q100 114 107 109" stroke="#7A4B24" strokeWidth="1.5" strokeLinecap="round" fill="none" />

      {/* Third eye / bindi */}
      <circle cx="100" cy="93" r="2.5" fill="#C4885A" filter="url(#glow)" />

      {/* Aura rings */}
      <circle cx="100" cy="100" r="60" stroke="#A9D4B5" strokeWidth="0.8" strokeDasharray="4 6" strokeOpacity="0.5" />
      <circle cx="100" cy="100" r="78" stroke="#D4E8D9" strokeWidth="0.6" strokeDasharray="3 8" strokeOpacity="0.4" />

      {/* Floating sparkles / petals */}
      <circle cx="46"  cy="70"  r="3.5" fill="#C4885A" fillOpacity="0.5" />
      <circle cx="154" cy="65"  r="2.5" fill="#6EAB83" fillOpacity="0.6" />
      <circle cx="40"  cy="120" r="2"   fill="#6EAB83" fillOpacity="0.4" />
      <circle cx="160" cy="115" r="3"   fill="#C4885A" fillOpacity="0.4" />
      <circle cx="55"  cy="45"  r="1.5" fill="#A9D4B5" fillOpacity="0.6" />
      <circle cx="148" cy="42"  r="2"   fill="#D49A70" fillOpacity="0.5" />
    </svg>
  );
}
