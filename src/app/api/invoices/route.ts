import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const studentId = session.user.role === "STUDENT" ? session.user.id : searchParams.get("studentId") ?? undefined;

  const invoices = await prisma.invoice.findMany({
    where: {
      ...(status ? { status: status as "PENDING" | "PAID" } : {}),
      ...(studentId ? { studentId } : {}),
    },
    include: { student: { select: { name: true, phone: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(invoices);
}
