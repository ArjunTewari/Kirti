import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { computeDashboardStats } from "@/lib/dashboard-stats";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session || session.user.role !== "TEACHER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const [studentCount, invoices] = await Promise.all([
    prisma.user.count({ where: { role: "STUDENT" } }),
    prisma.invoice.findMany({
      select: { status: true, amount: true, paidAt: true },
    }),
  ]);

  const stats = computeDashboardStats(studentCount, invoices);
  return NextResponse.json(stats);
}
