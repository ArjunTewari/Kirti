import { StudentSidebar } from "@/components/student/StudentSidebar";
import { StudentMobileNav } from "@/components/student/StudentMobileNav";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session || session.user.role !== "STUDENT") redirect("/login");

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--color-cream)" }}>
      <div className="hidden lg:flex">
        <StudentSidebar name={session.user.name ?? "Student"} />
      </div>
      <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">
        <div className="p-4 sm:p-6 max-w-4xl mx-auto">{children}</div>
      </main>
      <StudentMobileNav />
    </div>
  );
}
