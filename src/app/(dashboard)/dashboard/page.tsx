import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { computeDashboardStats } from "@/lib/dashboard-stats";
import { StatCard } from "@/components/dashboard/StatCard";
import { Users, FileText, IndianRupee, AlertCircle } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default async function DashboardPage() {
  const session = await auth();

  const [studentCount, invoices, upcomingClasses, recentAnnouncements] =
    await Promise.all([
      prisma.user.count({ where: { role: "STUDENT" } }),
      prisma.invoice.findMany({
        select: { status: true, amount: true, paidAt: true },
      }),
      prisma.classEvent.findMany({
        where: {
          date: { gte: new Date() },
          cancelledAt: null,
        },
        orderBy: { date: "asc" },
        take: 5,
      }),
      prisma.announcement.findMany({
        orderBy: { createdAt: "desc" },
        take: 3,
      }),
    ]);

  const stats = computeDashboardStats(studentCount, invoices);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {session?.user.name?.split(" ")[0]} 🙏
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          {format(new Date(), "EEEE, d MMMM yyyy")}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Students"
          value={stats.totalStudents}
          icon={Users}
          color="blue"
        />
        <StatCard
          label="Pending Invoices"
          value={stats.pendingInvoicesCount}
          icon={AlertCircle}
          color="amber"
          sub={`₹${stats.pendingAmount.toLocaleString("en-IN")} due`}
        />
        <StatCard
          label="This Month Revenue"
          value={`₹${stats.thisMonthRevenue.toLocaleString("en-IN")}`}
          icon={IndianRupee}
          color="emerald"
        />
        <StatCard
          label="Invoices Raised"
          value={invoices.length}
          icon={FileText}
          color="rose"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Classes */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Upcoming Classes</h2>
            <Link
              href="/dashboard/classes"
              className="text-sm text-emerald-600 hover:underline"
            >
              View all
            </Link>
          </div>
          {upcomingClasses.length === 0 ? (
            <p className="text-sm text-gray-400">No upcoming classes.</p>
          ) : (
            <ul className="space-y-3">
              {upcomingClasses.map((c) => (
                <li key={c.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{c.title}</p>
                    <p className="text-xs text-gray-400">
                      {format(new Date(c.date), "EEE, d MMM · h:mm a")}
                    </p>
                  </div>
                  <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    ₹{c.amount}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Announcements */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Announcements</h2>
            <Link
              href="/dashboard/announcements"
              className="text-sm text-emerald-600 hover:underline"
            >
              Manage
            </Link>
          </div>
          {recentAnnouncements.length === 0 ? (
            <p className="text-sm text-gray-400">No announcements yet.</p>
          ) : (
            <ul className="space-y-3">
              {recentAnnouncements.map((a) => (
                <li key={a.id} className="border-l-2 border-emerald-400 pl-3">
                  <p className="text-sm font-medium text-gray-800">{a.title}</p>
                  <p className="text-xs text-gray-400 truncate">{a.body}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/dashboard/classes/new"
            className="bg-emerald-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            + New Class
          </Link>
          <Link
            href="/dashboard/students/new"
            className="bg-white border border-gray-300 text-gray-700 text-sm px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            + Add Student
          </Link>
          <Link
            href="/dashboard/invoices"
            className="bg-white border border-gray-300 text-gray-700 text-sm px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            View Invoices
          </Link>
          <Link
            href="/dashboard/announcements/new"
            className="bg-white border border-gray-300 text-gray-700 text-sm px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Post Announcement
          </Link>
        </div>
      </div>
    </div>
  );
}
