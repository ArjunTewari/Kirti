import { Sidebar } from "@/components/dashboard/Sidebar";
import { MobileNav } from "@/components/dashboard/MobileNav";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session || session.user.role !== "TEACHER") redirect("/login");

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--color-cream)" }}>
      {/* Desktop sidebar */}
      <div className="hidden lg:flex">
        <Sidebar />
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">
        <div className="p-4 sm:p-6 max-w-6xl mx-auto">{children}</div>
      </main>

      {/* Mobile bottom nav */}
      <MobileNav />
    </div>
  );
}
