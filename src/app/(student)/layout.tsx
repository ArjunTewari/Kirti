import { StudentSidebar } from "@/components/student/StudentSidebar";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session || session.user.role !== "STUDENT") redirect("/login");

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <StudentSidebar name={session.user.name ?? "Student"} />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 max-w-4xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
